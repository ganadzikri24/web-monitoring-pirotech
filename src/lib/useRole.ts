"use client";

import { useState, useEffect } from "react";
import { auth } from "./firebase";

import { User } from "firebase/auth";

export type UserRole = 'admin' | 'operator' | null;

export const useRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (currentUser: any) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const idTokenResult = await currentUser.getIdTokenResult();
          const userRole = idTokenResult.claims.role as UserRole;
          const userUsername = idTokenResult.claims.username as string;
          setRole(userRole || 'operator'); // default to operator if no specific claim but logged in
          setUsername(userUsername || '');
        } catch (error) {
          console.error("Error fetching claims", error);
          setRole(null);
          setUsername('');
        }
      } else {
        setUser(null);
        setRole(null);
        setUsername('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { role, username, loading, isAdmin: role === 'admin', user };
};
