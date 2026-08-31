"use client";

import { useState, useEffect } from "react";
import { auth } from "./firebase";

import { User } from "firebase/auth";

export type UserRole = 'admin' | 'operator' | 'guest';

export const useRole = () => {
  const [role, setRole] = useState<UserRole>('guest');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (currentUser: any) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const idTokenResult = await currentUser.getIdTokenResult();
          const userRole = idTokenResult.claims.role as UserRole;
          setRole(userRole || 'operator'); // default to operator if no specific claim but logged in
        } catch (error) {
          console.error("Error fetching claims", error);
          setRole('guest');
        }
      } else {
        setUser(null);
        setRole('guest');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { role, loading, isAdmin: role === 'admin', user };
};
