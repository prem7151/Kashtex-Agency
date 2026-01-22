import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { sessionId, messages, visitorName, visitorEmail } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required' });
      }

      const { data, error } = await supabase
        .from('chat_logs')
        .insert([{ 
          session_id: sessionId, 
          messages: JSON.stringify(messages || []), 
          visitor_name: visitorName, 
          visitor_email: visitorEmail 
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ message: 'Failed to create chat log' });
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error('Chat log creation error:', error);
      return res.status(500).json({ message: 'Failed to create chat log' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
