import { createBrowserSupabase } from "@/lib/supabase";

export async function uploadSkmAsset(file: File, path: string) {
  const supabase = createBrowserSupabase();

  return supabase.storage.from("skm-assets").upload(path, file, {
    cacheControl: "3600",
    upsert: false
  });
}
