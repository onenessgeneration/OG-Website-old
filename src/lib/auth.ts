import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error(error.message);
    return;
  }
  toast.success("Signed out");
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}
