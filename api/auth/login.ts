import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({ 
        success: true, 
        token,
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Login failed' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
