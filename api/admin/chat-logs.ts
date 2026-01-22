import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';
import { verifyAuth } from '../lib/auth';
import { toCamelCase } from '../lib/transform';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = verifyAuth(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('chat_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ message: 'Failed to fetch chat logs' });
      }

      return res.status(200).json(toCamelCase(data));
    } catch (error) {
      console.error('Get chat logs error:', error);
      return res.status(500).json({ message: 'Failed to fetch chat logs' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
