/** Strip characters that could be used for XSS or injection */
export function sanitizeText(input: string, maxLength = 2000): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
    .slice(0, maxLength);
}

export function sanitizeEmail(raw: string): string {
  const cleaned = raw.trim().toLowerCase().slice(0, 254);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) ? cleaned : '';
}

export function sanitizePhone(raw: string): string {
  return raw.replace(/[^\d+\s\-(). ]/g, '').trim().slice(0, 20);
}

export function sanitizeContactForm(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  return {
    name: sanitizeText(data.name, 100),
    email: sanitizeEmail(data.email),
    phone: sanitizePhone(data.phone),
    message: sanitizeText(data.message, 1000),
  };
}
