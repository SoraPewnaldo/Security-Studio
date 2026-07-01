import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

interface ErrorResponseBody {
  success: false;
  error: string;
  details?: Array<{ path: string; message: string }>;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));

    const body: ErrorResponseBody = {
      success: false,
      error: 'Validation failed',
      details,
    };

    res.status(400).json(body);
    return;
  }

  if (err instanceof Error) {
    console.error(`[API Error] ${err.message}`, err.stack);

    const body: ErrorResponseBody = {
      success: false,
      error:
        process.env['NODE_ENV'] === 'production'
          ? 'Internal server error'
          : err.message,
    };

    res.status(500).json(body);
    return;
  }

  console.error('[API Error] Unknown error:', err);

  const body: ErrorResponseBody = {
    success: false,
    error: 'Internal server error',
  };

  res.status(500).json(body);
}
