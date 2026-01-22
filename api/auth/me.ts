import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };

      return res.status(200).json({ 
        user: { id: decoded.id, username: decoded.username } 
      });
    } catch (error) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
