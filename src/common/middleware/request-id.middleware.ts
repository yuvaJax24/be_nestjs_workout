import { randomUUID } from 'node:crypto';
import { Request, Response } from 'express';

export class RequestIdMiddleware {
  static attach(req: Request, res: Response, next: () => void): void {
    const requestId = req.headers['x-request-id']?.toString() ?? randomUUID();
    res.setHeader('x-request-id', requestId);
    req.headers['x-request-id'] = requestId;
    next();
  }
}
