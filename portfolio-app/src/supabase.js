import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ruseshhxylpckbxpujav.supabase.co";
const SUPABASE_KEY = "sb_publishable_mqlCi-67RuSNtUObLvJUVA_ZPKMC_bh";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
