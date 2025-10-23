// scripts/db.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// подключение к твоей базе Supabase
export const supabase = createClient(
  'https://eoxtgyskksdmvdxmxjab.supabase.co', // ← Project URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveHRneXNra3NkbXZkeG14amFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NDY0NDIsImV4cCI6MjA5ODIyMjQ0Mn0.sq6xdrhR66FxSCdx00yeFWv_6wzB4M1zENtb41u_hcs' // ← anon public key
);
