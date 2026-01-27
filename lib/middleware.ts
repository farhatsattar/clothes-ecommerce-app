import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../app/firebase/config';

// Middleware to check if user is authenticated
export const requireAuth = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Please log in to access this resource'
      });
      return;
    }

    // Add user to request object for use in subsequent handlers
    (req as any).user = user;
    next();
  }, (error) => {
    console.error('Authentication state change error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  });

  // Clean up subscription after short delay
  setTimeout(() => {
    unsubscribe();
  }, 100);
};

// Error handling middleware
export const errorHandler = (err: any, req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};

// Validation middleware
export const validateBody = (schema: any) => {
  return (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      // In a real implementation, we would use a validation library like Joi or Zod
      // For now, we'll just proceed to the next middleware
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || 'Invalid request body'
      });
    }
  };
};

// CORS middleware
export const cors = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};