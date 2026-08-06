// TODO: hapus mock auth & mock data setelah Firebase disetup
import { UserRole } from "./useRole";

export const MOCK_ADMIN_EMAIL = "admin@pirotech.id";
export const MOCK_ADMIN_PASSWORD = "admin123";

export const setMockSession = (role: UserRole) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("mock_auth_role", role);
  }
};

export const getMockSession = (): UserRole | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("mock_auth_role") as UserRole | null;
  }
  return null;
};

export const clearMockSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("mock_auth_role");
  }
};
