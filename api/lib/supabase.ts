import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  details: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};

export type User = {
  id: string;
  username: string;
  password: string;
  created_at: string;
};

export type ChatLog = {
  id: string;
  session_id: string;
  messages: string;
  visitor_name: string | null;
  visitor_email: string | null;
  created_at: string;
};
