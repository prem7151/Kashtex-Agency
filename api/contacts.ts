import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './lib/supabase';
import { sendContactNotification } from './lib/email';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const { data, error } = await supabase
        .from('contacts')
        .insert([{ name, email, subject, message, is_read: false }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ message: 'Failed to submit contact form' });
      }

      sendContactNotification({ name, email, subject, message }).catch(console.error);

      return res.status(201).json(data);
    } catch (error) {
      console.error('Contact creation error:', error);
      return res.status(500).json({ message: 'Failed to submit contact form' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
