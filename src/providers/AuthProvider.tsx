import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Session } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";

type AuthContextData = {
  session: Session | null;
  loading: boolean;
};

const AuthContext =
  createContext<AuthContextData>(
    {} as AuthContextData
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] =
    useState<Session | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      console.log(
        "📦 SESSION INICIAL:",
        session?.user?.email
      );

      setSession(session);
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(
          "🔄 AUTH EVENT:",
          event
        );

        console.log(
          "👤 USER:",
          session?.user?.email
        );

        if (mounted) {
          setSession(session);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}