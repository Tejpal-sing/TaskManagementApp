import { Request, Response, NextFunction } from 'express';
import jwt, { JsonWebTokenError,TokenExpiredError } from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: number;
    }
}

interface JwtPayload {
    id: number;
    iat?: number;
    exp?: number;
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
 
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log(token);

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret') as JwtPayload;
        req.user = { id: decoded.id };
        next();
    } catch (err: unknown) {
        if (err instanceof TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Token has expired"
            });
        } else if (err instanceof JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Token is not valid"
            });
        }
        if (err instanceof JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Token is not valid"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};