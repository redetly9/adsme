import axios from "axios"

export const api = axios.create({
  baseURL: 'https://adsme-proxy.vercel.app/',
  headers: {'X-Custom-Header': 'foobar'}
});

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eziznurhenjecbvtduub.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aXpudXJoZW5qZWNidnRkdXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyOTYyNDMsImV4cCI6MjAyOTg3MjI0M30.6K6oQ1M-qvv5up-LzKSmNyx79lRMlU7pkBwAPYh5UaU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
