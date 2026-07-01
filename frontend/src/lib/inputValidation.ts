/** Shared client-side limits — keep aligned with backend InputLimits where applicable. */
export const INPUT_LIMITS = {
  email: 254,
  password: 72,
  personName: 120,
  reviewComment: 2000,
  supportMessage: 5000,
  catalogSearch: 200,
} as const;

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Strips control characters, trims, and caps length (defense in depth before API calls). */
export function sanitizeText(value: string, maxLength: number): string {
  return value.replace(CONTROL_CHARS, "").trim().slice(0, maxLength);
}

export function isValidEmail(value: string): boolean {
  const trimmed = sanitizeText(value, INPUT_LIMITS.email);
  return trimmed.length > 0 && EMAIL_PATTERN.test(trimmed) && trimmed.length <= INPUT_LIMITS.email;
}

export function validatePassword(value: string, minLength = 8): string | null {
  if (value.length < minLength) {
    return `Пароль має містити щонайменше ${minLength} символів.`;
  }
  if (value.length > INPUT_LIMITS.password) {
    return `Пароль не може перевищувати ${INPUT_LIMITS.password} символів.`;
  }
  return null;
}

export function validatePersonName(value: string): string | null {
  const name = sanitizeText(value, INPUT_LIMITS.personName);
  if (!name) return "Введіть повне ім'я.";
  return null;
}

export function validateReviewComment(value: string): string | null {
  const comment = sanitizeText(value, INPUT_LIMITS.reviewComment);
  if (comment.length < 3) return "Коментар має містити щонайменше 3 символи.";
  return null;
}

export function validateSupportMessage(value: string): string | null {
  const message = sanitizeText(value, INPUT_LIMITS.supportMessage);
  if (message.length < 3) return "Повідомлення занадто коротке.";
  return null;
}

/**
 * React escapes text in JSX by default. This helper removes control characters
 * before display as an extra safeguard for user-generated content.
 */
export function safeDisplayText(value: string, maxLength = 10_000): string {
  return sanitizeText(value, maxLength);
}
