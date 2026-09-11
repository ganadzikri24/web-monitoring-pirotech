#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <U8g2lib.h>
#include <max6675.h>
#include <ArduinoJson.h>
#include <Wire.h>

// ==========================================
// 1. KONFIGURASI JARINGAN & CLOUD
// ==========================================
const char* WIFI_SSID = "PIROTECH";
const char* WIFI_PASS = "pirotek12345678";

const char* API_URL    = "https://prikitiw-18dde-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_data.json";
const char* CONFIG_URL = "https://prikitiw-18dde-default-rtdb.asia-southeast1.firebasedatabase.app/pirotech/config.json";
const char* BUZZER_URL = "https://prikitiw-18dde-default-rtdb.asia-southeast1.firebasedatabase.app/control/buzzer.json";

const char* DEVICE_ID = "ESP32-01";

// ==========================================
// 2. KONFIGURASI HARDWARE (PINS - SISI KIRI)
// ==========================================
const int PIN_SCK    = 5;  
const int PIN_CS     = 19; 
const int PIN_SO     = 18; 
const int PIN_BUZZER = 25; 

const int PIN_SDA    = 22; 
const int PIN_SCL    = 21; 

MAX6675 thermocouple(PIN_SCK, PIN_CS, PIN_SO);
U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);

// ==========================================
// 3. VARIABEL GLOBAL & MUTEX
// ==========================================
float globalSuhuC = 0.0;
bool globalSensorError = false;
float globalOverheatLimit = 100.0; 

// PENTING: nama & semantik diperjelas.
// true  = alarm boleh bunyi saat overheat (default / normal)
// false = alarm DIBISUKAN SECARA EKSPLISIT dari app/Firebase
bool globalBuzzerEnabled = true; 
SemaphoreHandle_t dataMutex;

// Konstanta batas fisik layar untuk auto-centering
const int SCREEN_WIDTH = 128;

// ==========================================
// FUNGSI HELPER: AUTO-CENTERING TEKS
// ==========================================
void drawCenteredString(int y, const char* text) {
  int textWidth = u8g2.getStrWidth(text);
  int startX = (SCREEN_WIDTH - textWidth) / 2;
  
  if (startX < 0) {
    startX = 0; 
  }
  
  u8g2.drawStr(startX, y, text);
}

// ==========================================
// TASK 1: KESELAMATAN & SENSOR (CORE 1)
// ==========================================
void TaskSafetyControl(void *pvParameters) {
  (void) pvParameters; 
  unsigned long lastOledUpdate = 0;
  unsigned long lastDebugPrint = 0;
  
  for (;;) {
    unsigned long currentMillis = millis(); 
    
    float tempSuhu = thermocouple.readCelsius();
    bool tempError = isnan(tempSuhu);
    float currentOverheatLimit = 100.0; 
    bool currentBuzzerEnabled = true;

    if (xSemaphoreTake(dataMutex, portMAX_DELAY) == pdTRUE) {
      globalSuhuC = tempSuhu;
      globalSensorError = tempError;
      currentOverheatLimit = globalOverheatLimit; 
      currentBuzzerEnabled = globalBuzzerEnabled; 
      xSemaphoreGive(dataMutex); 
    }

    int buzzerInterval = 0;
    bool isOverheat = (!tempError) && (tempSuhu >= currentOverheatLimit);
    
    if (tempError) {
      // FIX: sensor error juga bisa dimute dari app
      buzzerInterval = currentBuzzerEnabled ? 500 : 0;
    } 
    else if (isOverheat) {
      buzzerInterval = currentBuzzerEnabled ? 100 : 0;
    } 
    else {
      buzzerInterval = 0;   
    }

    if (buzzerInterval > 0) {
      if (currentMillis % (buzzerInterval * 2) < buzzerInterval) {
        digitalWrite(PIN_BUZZER, HIGH);
      } else {
        digitalWrite(PIN_BUZZER, LOW);
      }
    } else {
       digitalWrite(PIN_BUZZER, LOW);
    }

    // Debug: print status tiap 1 detik supaya mudah dilacak lewat Serial Monitor
    if (currentMillis - lastDebugPrint >= 1000) {
      lastDebugPrint = currentMillis;
      Serial.printf("[Safety] suhu=%.2f limit=%.2f err=%d overheat=%d buzzerEnabled=%d interval=%d\n",
                     tempSuhu, currentOverheatLimit, tempError, isOverheat, currentBuzzerEnabled, buzzerInterval);
    }

    if (currentMillis - lastOledUpdate >= 500) {
      lastOledUpdate = currentMillis;
      
      u8g2.clearBuffer();
      
      // Baris 1: Informasi Suhu (Dinamis Tengah)
      u8g2.setFont(u8g2_font_helvB14_tf);
      if (tempError) {
        drawCenteredString(25, "Suhu: ERR");
      } else {
        char tempBuf[20];
        snprintf(tempBuf, sizeof(tempBuf), "Suhu: %.2f C", tempSuhu);
        drawCenteredString(25, tempBuf);
      }
      
      // Baris 2: Status Sistem (Dinamis Tengah)
      u8g2.setFont(u8g2_font_6x12_tf);
      if (tempError) {
        drawCenteredString(55, "ERR: SENSOR PUTUS");
      } else if (isOverheat) {
        drawCenteredString(55, currentBuzzerEnabled ? "WARN: OVERHEAT!" : "WARN: OVERHEAT (MUTE)");
      } else if (WiFi.status() != WL_CONNECTED) {
        drawCenteredString(55, "WiFi Disconnected!");
      } else {
        drawCenteredString(55, "System: Normal (OK)");
      }
      
      u8g2.sendBuffer();
    }

    vTaskDelay(pdMS_TO_TICKS(300)); 
  }
}

// ==========================================
// TASK 2: JARINGAN & CLOUD API (CORE 0)
// ==========================================
void TaskNetworkCloud(void *pvParameters) {
  (void) pvParameters;

  WiFiClientSecure secureClient;
  secureClient.setInsecure(); // Firebase RTDB pakai cert publik standar; skip validasi CA untuk kesederhanaan

  for (;;) {
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[Core 0] Reconnecting WiFi...");
      WiFi.disconnect();
      WiFi.begin(WIFI_SSID, WIFI_PASS);
      
      int retries = 0;
      while (WiFi.status() != WL_CONNECTED && retries < 20) {
        vTaskDelay(pdMS_TO_TICKS(500));
        retries++;
      }
    }

    if (WiFi.status() == WL_CONNECTED) {
      float suhuKirim = 0.0;
      bool sensorError = false;

      if (xSemaphoreTake(dataMutex, portMAX_DELAY) == pdTRUE) {
        suhuKirim = globalSuhuC;
        sensorError = globalSensorError;
        xSemaphoreGive(dataMutex);
      }

      if (!sensorError) {
        char jsonPayload[150];
        snprintf(jsonPayload, sizeof(jsonPayload), 
                 "{\"device_id\":\"%s\",\"temperature_c\":%.2f,\"status\":\"running\",\"timestamp\": {\".sv\": \"timestamp\"}}", 
                 DEVICE_ID, suhuKirim);

        HTTPClient httpPost;
        httpPost.setReuse(true); 
        httpPost.begin(secureClient, API_URL);
        httpPost.addHeader("Content-Type", "application/json");
        int httpResponseCode = httpPost.POST(jsonPayload); 
        Serial.printf("[Network] POST sensor_data -> code=%d\n", httpResponseCode);
        httpPost.end(); 
      }

      HTTPClient httpGet;
      httpGet.setReuse(true); 
      httpGet.begin(secureClient, CONFIG_URL); 
      
      int getResponseCode = httpGet.GET();
      if (getResponseCode == 200) {
         String payload = httpGet.getString(); 
         JsonDocument doc; 
         DeserializationError error = deserializeJson(doc, payload);
         
         if (!error) {
            float limitBaru = doc["overheat_limit"];
            if (limitBaru > 0.0) {
               if (xSemaphoreTake(dataMutex, portMAX_DELAY) == pdTRUE) {
                  globalOverheatLimit = limitBaru;
                  xSemaphoreGive(dataMutex);
               }
            }
         }
      } else {
        Serial.printf("[Network] GET config gagal -> code=%d\n", getResponseCode);
      }
      httpGet.end();

      HTTPClient httpBuzzer;
      httpBuzzer.setReuse(true);
      httpBuzzer.begin(secureClient, BUZZER_URL);
      
      int buzzerResCode = httpBuzzer.GET();
      if (buzzerResCode == 200) {
          String buzzerPayload = httpBuzzer.getString();
          buzzerPayload.trim();

          // FIX (fail-open): hanya mute kalau nilainya EKSPLISIT "false".
          // Kalau field belum ada ("null"), kosong, atau nilainya "true" -> tetap ENABLED.
          bool enabled = true;
          if (buzzerPayload.equalsIgnoreCase("false")) {
            enabled = false;
          }

          Serial.printf("[Network] GET control/buzzer -> code=%d payload='%s' enabled=%d\n",
                         buzzerResCode, buzzerPayload.c_str(), enabled);

          if (xSemaphoreTake(dataMutex, portMAX_DELAY) == pdTRUE) {
              globalBuzzerEnabled = enabled;
              xSemaphoreGive(dataMutex);
          }
      } else {
        Serial.printf("[Network] GET control/buzzer gagal -> code=%d (mempertahankan status terakhir)\n", buzzerResCode);
        // Sengaja tidak mengubah globalBuzzerEnabled kalau request gagal,
        // supaya buzzer tidak ikut mati hanya karena koneksi/timeout.
      }
      httpBuzzer.end();
    }

    vTaskDelay(pdMS_TO_TICKS(2000));
  }
}

// ==========================================
// SETUP & INITIALIZATION
// ==========================================
void setup() {
  Serial.begin(115200); 
  
  pinMode(PIN_BUZZER, OUTPUT);
  digitalWrite(PIN_BUZZER, LOW);
  
  Wire.begin(PIN_SDA, PIN_SCL);
  
  u8g2.begin();
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_6x12_tf);
  drawCenteredString(30, "Booting RTOS..."); 
  u8g2.sendBuffer();

  dataMutex = xSemaphoreCreateMutex();
  
  xTaskCreatePinnedToCore(TaskSafetyControl, "Task_Safety", 4096, NULL, 2, NULL, 1);
  xTaskCreatePinnedToCore(TaskNetworkCloud, "Task_Network", 8192, NULL, 1, NULL, 0);
}

void loop() {
  vTaskDelete(NULL);
}
