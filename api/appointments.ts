import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './lib/supabase';
import { sendAppointmentNotification } from './lib/email';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, phone, service, date, time, details } = req.body;
      
      if (!name || !email || !phone || !service || !date || !time) {
        return res.status(400).json({ message: 'Required fields are missing' });
      }

      const { data: existing } = await supabase
        .from('appointments')
        .select('id')
        .eq('date', date)
        .eq('time', time)
        .neq('status', 'cancelled');

      if (existing && existing.length > 0) {
        return res.status(409).json({ 
          message: 'This time slot is already booked. Please choose another time.' 
        });
      }

      const { data, error } = await supabase
        .from('appointments')
        .insert([{ name, email, phone, service, date, time, details, status: 'pending' }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ message: 'Failed to book appointment' });
      }

      sendAppointmentNotification({ name, email, service, date, time, details }).catch(console.error);

      return res.status(201).json(data);
    } catch (error) {
      console.error('Appointment creation error:', error);
      return res.status(500).json({ message: 'Failed to book appointment' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
