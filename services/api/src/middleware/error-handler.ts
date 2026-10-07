import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiErrorResponse } from '@fit3d/types';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response<ApiErrorResponse>,
  _next: NextFunction
): void {
  const timestamp = new Date().toISOString();

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed on input payload',
      code: 'VALIDATION_ERROR',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
      timestamp,
    });
    return;
  }

  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    res.status(400).json({
      error: 'Malformed JSON payload received',
      code: 'BAD_REQUEST',
      timestamp,
    });
    return;
  }

  // Developer diagnostic info without leaking sensitive memory/payloads
  console.error('[SERVER_ERROR]', err instanceof Error ? err.message : 'Unknown error');

  res.status(500).json({
    error: 'An internal server error occurred while processing fitting request',
    code: 'INTERNAL_SERVER_ERROR',
    timestamp,
  });
}
