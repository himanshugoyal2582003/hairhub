import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTimeAgo(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function getWhatsAppLink(number: string, message?: string): string {
  const clean = number.replace(/\D/g, '');
  const phone = clean.startsWith('91') ? clean : `91${clean}`;
  const text = encodeURIComponent(
    message ?? `Hi! I saw your hair listing on HairHub India and I'm interested.`
  );
  return `https://wa.me/${phone}?text=${text}`;
}

export function getCloudinaryUrl(
  publicId: string,
  options: { width?: number; height?: number; crop?: string; quality?: number } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || publicId.startsWith('http')) return publicId;

  const transforms: string[] = ['f_auto'];
  if (options.quality) transforms.push(`q_${options.quality}`);
  else transforms.push('q_auto');
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`;
}

export function getHairLengthLabel(inches: number): string {
  if (inches < 12) return 'Short';
  if (inches <= 20) return 'Medium';
  return 'Long';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + '…';
}
