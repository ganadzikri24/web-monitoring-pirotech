"use client";

import { useState, useEffect } from "react";
import { auth } from "./firebase";

export type UserRole = 'admin' | 'operator' | 'guest';

export const useRole = () => {
  const [role, setRole] = useState<UserRole>('guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user: any) => {
      if (user) {
        try {
          const idTokenResult = await user.getIdTokenResult();
          const userRole = idTokenResult.claims.role as UserRole;
          setRole(userRole || 'operator'); // default to operator if no specific claim but logged in
        } catch (error) {
          console.error("Error fetching claims", error);
          setRole('guest');
        }
      } else {
        setRole('guest');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { role, loading, isAdmin: role === 'admin' };
};
