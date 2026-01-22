import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { data: existingUsers } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        return res.status(400).json({ message: 'Admin already exists' });
      }

      const hashedPassword = await bcrypt.hash('kashtex2026', 10);

      const { data, error } = await supabase
        .from('users')
        .insert([{ username: 'admin', password: hashedPassword }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ message: 'Failed to create admin' });
      }

      return res.status(201).json({ 
        message: 'Admin created successfully',
        user: { id: data.id, username: data.username }
      });
    } catch (error) {
      console.error('Admin setup error:', error);
      return res.status(500).json({ message: 'Failed to create admin' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
