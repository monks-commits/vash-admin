 // scripts/db.js  (БЕЗ <script> и </script>)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://YOUR_PROJECT_REF.supabase.co', // ← Project URL из Supabase → Settings → API
  'YOUR_PUBLIC_ANON_KEY'                  // ← anon public key из той же страницы
);
