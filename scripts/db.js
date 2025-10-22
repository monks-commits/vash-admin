// scripts/db.js  (ESM-модуль, БЕЗ <script> тегов)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Твои данные Supabase:
const SUPABASE_URL = 'https://hkeuabtiemsxadusmqlo.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZXVhYnRpZW1zeGFkdXNtcWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDE3MzcsImV4cCI6MjA3NjE3NzczN30.aOHorW8nvctPxC1If_HNTl6iq_7cDHzFgFEPJg3PPPE';

// Единый клиент на весь сайт
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
