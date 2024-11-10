/*
FIX ME (types) 😭
*/
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface User {
      role: string;
    }
  }
}

interface AuthenticatedRequest extends Request {
  user?: Express.User;
}

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  // if the user is authenticated, continue with the request
  if (req.isAuthenticated()) {
    
    return next();
  }
  // if the user is not authenticated, redirect to the login page
  res.redirect("/auth/login");
}

export const ensureAdmin = (req: Request, res: Response, next: NextFunction): void => {
  // if the user is authenticated and has the role of admin, continue with the request
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  // if the user is not authenticated or does not have the role of admin, redirect to the login page
  res.redirect("/auth/login");
}

/*
FIX ME (types) 😭
*/
export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
}