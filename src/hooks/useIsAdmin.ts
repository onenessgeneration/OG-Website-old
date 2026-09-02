import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/app-client";
import { useAuthUser } from "./useAuthUser";

export function useIsAdmin() {
  const { user, loading: authLoading } = useAuthUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    let alive = true;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return;
        setIsAdmin(!!data);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user, authLoading]);

  return { isAdmin, user, loading: authLoading || loading };
}
