/**
 * HTTP Security Headers Middleware
 * Developer: Disha (Backend Developer)
 * Sprint: Day 5 & 6 — Integration, Security & Production Hardening
 */

export function securityHeaders(req, res, next) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking / framing
  res.setHeader('X-Frame-Options', 'DENY');

  // Cross-Site Scripting (XSS) filter protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Strict Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy (restrict device capabilities)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Strict Transport Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Remove Express fingerprinting header
  res.removeHeader('X-Powered-By');

  next();
}
