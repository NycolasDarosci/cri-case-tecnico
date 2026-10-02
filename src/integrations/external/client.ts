import { createClient } from "@supabase/supabase-js";

// External project "Case Tecnico CRI" — publishable key is safe for the browser.
const URL = "https://sxumbqzhggylgwwkymah.supabase.co";
const KEY = "sb_publishable_cDEKq68K0gNP4Fi7xXK7wA_QJlpYdAg";

export const criDb = createClient(URL, KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (headers.get("Authorization") === `Bearer ${KEY}`) headers.delete("Authorization");
      headers.set("apikey", KEY);
      return fetch(input, { ...init, headers });
    },
  },
});
