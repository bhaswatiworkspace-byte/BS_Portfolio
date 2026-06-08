import { WHATSAPP_NUMBER } from './config';

export function buildWhatsAppUrl(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): string {
  const lines = [
    '*New Portfolio Contact*',
    `Name: ${data.name}`,
    data.email ? `Email: ${data.email}` : null,
    data.phone ? `Phone: ${data.phone}` : null,
    `\nMessage:\n${data.message}`,
  ].filter(Boolean);

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/** Simple in-memory rate limiter: returns false if too soon */
let lastSubmission = 0;
export function checkRateLimit(limitMs: number): boolean {
  const now = Date.now();
  if (now - lastSubmission < limitMs) return false;
  lastSubmission = now;
  return true;
}
