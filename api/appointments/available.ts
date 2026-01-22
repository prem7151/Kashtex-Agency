import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const date = req.query.date as string;
      
      if (!date) {
        return res.status(400).json({ message: 'Date parameter required' });
      }

      const { data: bookedAppointments } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', date)
        .neq('status', 'cancelled');

      const bookedTimes = (bookedAppointments || []).map(a => a.time);
      const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
      const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

      return res.status(200).json({ date, availableSlots, bookedTimes });
    } catch (error) {
      console.error('Available slots error:', error);
      return res.status(500).json({ message: 'Failed to fetch available slots' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
