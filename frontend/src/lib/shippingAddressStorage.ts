export interface SavedShippingAddress {
  streetAddress: string;
  city: string;
  phone: string;
}

const STORAGE_PREFIX = "electrofit-shipping-address";

function storageKey(email: string): string {
  return `${STORAGE_PREFIX}:${email.trim().toLowerCase()}`;
}

export function loadSavedShippingAddress(email: string): SavedShippingAddress | null {
  if (typeof window === "undefined" || !email.trim()) return null;

  try {
    const raw = localStorage.getItem(storageKey(email));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<SavedShippingAddress>;
    if (
      typeof parsed.streetAddress !== "string" ||
      typeof parsed.city !== "string" ||
      typeof parsed.phone !== "string"
    ) {
      return null;
    }

    return {
      streetAddress: parsed.streetAddress,
      city: parsed.city,
      phone: parsed.phone,
    };
  } catch {
    return null;
  }
}

export function saveSavedShippingAddress(
  email: string,
  address: SavedShippingAddress,
): void {
  if (typeof window === "undefined" || !email.trim()) return;

  localStorage.setItem(
    storageKey(email),
    JSON.stringify({
      streetAddress: address.streetAddress.trim(),
      city: address.city.trim(),
      phone: address.phone.trim(),
    }),
  );
}
