/**
 * For Cloudinary URLs, ask for an auto-format, auto-quality, resized version.
 * Local images (/work/...) are returned unchanged.
 */
export function img(src: string, width = 1200): string {
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) return src;
  return src.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

export function whatsappLink(phone: string, text?: string): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function telLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+${digits.startsWith("0") ? `234${digits.slice(1)}` : digits}`;
}
