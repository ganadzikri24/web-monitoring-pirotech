/* eslint-disable @typescript-eslint/no-require-imports */
const { onValueCreated } = require("firebase-functions/v2/database");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

admin.initializeApp();

exports.notifyBatchStart = onValueCreated(
  "/pirotech/latest/startTs",
  async (event) => {
    const startTs = event.data.val();
    
    if (!startTs) return null;

    logger.info(`New batch started at ${startTs}`);

    const payload = {
      notification: {
        title: "Proses Pirolisis Dimulai",
        body: "Batch baru telah dimulai. Pantau suhu dan status proses di dashboard.",
      },
    };

    // Get all admin FCM tokens (assuming they are stored in pirotech/notifications/admins/{uid}/fcmTokens)
    const tokensSnapshot = await admin.database().ref("pirotech/notifications/admins").once("value");
    const admins = tokensSnapshot.val();
    
    if (!admins) {
      logger.info("No admins found to notify.");
      return null;
    }

    let tokens = [];
    Object.values(admins).forEach(adminData => {
      if (adminData.fcmTokens) {
        tokens = tokens.concat(Object.values(adminData.fcmTokens));
      }
    });

    if (tokens.length === 0) {
      logger.info("No FCM tokens found.");
      return null;
    }

    try {
      const response = await admin.messaging().sendToDevice(tokens, payload);
      logger.info(`Notifications sent: ${response.successCount} successful, ${response.failureCount} failed`);
    } catch (error) {
      logger.error("Error sending notifications", error);
    }
  }
);
