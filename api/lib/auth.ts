import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function verifyAuth(req: VercelRequest): { id: string; username: string } | null {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET) as { id: string; username: string };
  } catch {
    return null;
  }
}

export function requireAuth(
  handler: (req: VercelRequest, res: VercelResponse, user: { id: string; username: string }) => Promise<VercelResponse | void>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const user = verifyAuth(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return handler(req, res, user);
  };
}
