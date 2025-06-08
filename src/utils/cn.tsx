import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPhoneNumber = (phone: string): string => {
  if (!phone || phone.length < 6) {
    return "*** *** *** ***+";
  }

  // Remove any non-digit characters except '+'
  const cleanPhone = phone.replace(/[^\d+]/g, "");

  // Handle the country code (assuming it starts with '+')
  const hasPlus = cleanPhone.startsWith("+");
  const countryCode = hasPlus ? cleanPhone.substring(0, 4) : cleanPhone.substring(0, 3);
  const remainingDigits = hasPlus ? cleanPhone.substring(4) : cleanPhone.substring(3);

  // Create the masked parts
  let maskedParts = [];
  for (let i = 0; i < remainingDigits.length; i += 3) {
    maskedParts.push("***");
  }

  // Ensure we have at least 3 groups of asterisks
  while (maskedParts.length < 3) {
    maskedParts.push("***");
  }

  // Join the parts in RTL order
  return `${maskedParts.join(" ")} ${countryCode}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInDays < 30) {
    return `${diffInDays} يوم`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} شهر`;
  } else {
    return `${diffInYears} سنة`;
  }
};
