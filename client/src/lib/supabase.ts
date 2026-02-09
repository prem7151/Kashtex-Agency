import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || 'placeholder-key';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

const isConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return url && url !== 'https://placeholder.supabase.co';
};

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

export type ChatLog = {
  id: string;
  session_id: string;
  messages: string;
  visitor_name: string | null;
  visitor_email: string | null;
  created_at: string;
};

export type User = {
  id: string;
  username: string;
  password: string;
  created_at: string;
};

export async function submitContact(data: { name: string; email: string; subject: string; message: string }) {
  if (!isConfigured()) {
    console.log('Supabase not configured - contact form submission simulated');
    return { id: 'demo', ...data, is_read: false, created_at: new Date().toISOString() };
  }
  const { data: result, error } = await supabase
    .from('contacts')
    .insert([{ ...data, is_read: false }])
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

export async function bookAppointment(data: { 
  name: string; 
  email: string; 
  phone: string; 
  service: string; 
  date: string; 
  time: string; 
  details?: string;
}) {
  if (!isConfigured()) {
    console.log('Supabase not configured - appointment booking simulated');
    return { id: 'demo', ...data, status: 'pending', created_at: new Date().toISOString() };
  }
  const existing = await supabase
    .from('appointments')
    .select('id')
    .eq('date', data.date)
    .eq('time', data.time)
    .neq('status', 'cancelled');
  
  if (existing.data && existing.data.length > 0) {
    throw new Error('This time slot is already booked');
  }

  const { data: result, error } = await supabase
    .from('appointments')
    .insert([{ ...data, status: 'pending' }])
    .select()
    .single();
  
  if (error) throw error;
  return result;
}

export async function getAvailableSlots(date: string) {
  const allSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  if (!isConfigured()) {
    return allSlots;
  }

  const { data: bookedAppointments } = await supabase
    .from('appointments')
    .select('time')
    .eq('date', date)
    .neq('status', 'cancelled');

  const bookedTimes = new Set(bookedAppointments?.map(a => a.time) || []);
  return allSlots.filter(slot => !bookedTimes.has(slot));
}

export async function createChatSession(sessionId: string) {
  if (!isConfigured()) {
    console.log('Supabase not configured - chat session simulated');
    return { id: 'demo', session_id: sessionId, messages: '[]', created_at: new Date().toISOString() };
  }
  const { data, error } = await supabase
    .from('chat_logs')
    .insert([{ session_id: sessionId, messages: '[]' }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateChatLog(sessionId: string, messages: any[], visitorName?: string, visitorEmail?: string) {
  if (!isConfigured()) {
    console.log('Supabase not configured - chat log update simulated');
    return { id: 'demo', session_id: sessionId, messages: JSON.stringify(messages), created_at: new Date().toISOString() };
  }
  const updateData: any = { messages: JSON.stringify(messages) };
  if (visitorName) updateData.visitor_name = visitorName;
  if (visitorEmail) updateData.visitor_email = visitorEmail;

  const { data, error } = await supabase
    .from('chat_logs')
    .update(updateData)
    .eq('session_id', sessionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = '$2b$10$VKBMSCajJv4ssBAJWmDnCuDhsbDMQsW.qd7L0u/CuCpKvoIW/iAxG';

export async function adminLogin(username: string, password: string) {
  if (username !== ADMIN_USERNAME) {
    throw new Error('Invalid credentials');
  }

  const bcrypt = await import('bcryptjs');
  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  localStorage.setItem('admin_authenticated', 'true');
  localStorage.setItem('admin_user', JSON.stringify({ id: 'admin', username: ADMIN_USERNAME }));
  return { id: 'admin', username: ADMIN_USERNAME };
}

export function adminLogout() {
  localStorage.removeItem('admin_authenticated');
  localStorage.removeItem('admin_user');
}

export function isAdminAuthenticated() {
  return localStorage.getItem('admin_authenticated') === 'true';
}

export function getAdminUser() {
  const user = localStorage.getItem('admin_user');
  return user ? JSON.parse(user) : null;
}

export async function getContacts() {
  if (!isConfigured()) {
    return [];
  }
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function markContactRead(id: string) {
  if (!isConfigured()) {
    return { id, is_read: true };
  }
  const { data, error } = await supabase
    .from('contacts')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getAppointments() {
  if (!isConfigured()) {
    return [];
  }
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function updateAppointmentStatus(id: string, status: string) {
  if (!isConfigured()) {
    return { id, status };
  }
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getChatLogs() {
  if (!isConfigured()) {
    return [];
  }
  const { data, error } = await supabase
    .from('chat_logs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
