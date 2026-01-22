import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { sessionId } = req.query;

  if (req.method === 'PATCH') {
    try {
      const { messages, visitorName, visitorEmail } = req.body;

      const { data: existing } = await supabase
        .from('chat_logs')
        .select('id')
        .eq('session_id', sessionId)
        .single();

      if (!existing) {
        const { data, error } = await supabase
          .from('chat_logs')
          .insert([{ 
            session_id: sessionId as string, 
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
      }

      const { data, error } = await supabase
        .from('chat_logs')
        .update({ 
          messages: JSON.stringify(messages || []), 
          visitor_name: visitorName || undefined, 
          visitor_email: visitorEmail || undefined 
        })
        .eq('session_id', sessionId)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ message: 'Failed to update chat log' });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error('Chat log update error:', error);
      return res.status(500).json({ message: 'Failed to update chat log' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
