import { Request, Response, NextFunction } from 'express';

/**
 * Privacy-preserving audit and operational logger.
 * STRICT PRIVACY REQUIREMENT:
 * Under NO circumstances are request bodies, base64 images, biometric measurements,
 * or user garment assets logged to console, disk, or external log collectors.
 */
export function privacySafeLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    // Sanitize URL for log output (strip query params that might leak tokens)
    const sanitizedPath = originalUrl.split('?')[0];

    // Safe operational telemetry line
    const logLine = `[AUDIT] ${new Date().toISOString()} | ${method} ${sanitizedPath} | Status: ${statusCode} | ${duration}ms`;

    if (statusCode >= 500) {
      console.error(logLine);
    } else if (statusCode >= 400) {
      console.warn(logLine);
    } else {
      console.log(logLine);
    }
  });

  next();
}
