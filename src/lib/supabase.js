import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wsyuwonrcfogrxkitcfv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeXV3b25yY2ZvZ3J4a2l0Y2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMjI5OTQsImV4cCI6MjA5NjY5ODk5NH0.kg2i_YmyA7RBzacADRh1oEB38x-X_jh0lqc1H6bTHao';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});