import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../../../lib/supabase';
import { verifyAuth } from '../../../lib/auth';
import { toCamelCase } from '../../../lib/transform';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const user = verifyAuth(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ message: 'Failed to update contact' });
      }

      if (!data) {
        return res.status(404).json({ message: 'Contact not found' });
      }

      return res.status(200).json(toCamelCase(data));
    } catch (error) {
      console.error('Mark read error:', error);
      return res.status(500).json({ message: 'Failed to update contact' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
