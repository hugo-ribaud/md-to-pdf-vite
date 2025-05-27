import { NextFunction, Request, Response } from 'express';

export const logger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  // Log request
  console.log(`📥 ${req.method} ${req.url}`, {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    ...(Object.keys(req.body).length > 0 && {
      bodyKeys: Object.keys(req.body),
    }),
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (body: any) {
    const duration = Date.now() - start;

    console.log(`📤 ${req.method} ${req.url} - ${res.statusCode}`, {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      statusCode: res.statusCode,
      ...(res.statusCode >= 400 && { responseBody: body }),
    });

    return originalJson.call(this, body);
  };

  next();
};
