import toast from "react-hot-toast";

export function toastAddedToCart(productName: string) {
  toast.success(`Додано до кошика: ${productName}`);
}

export function toastAddedSet(label: string) {
  toast.success(`Додано до кошика: ${label}`);
}

export function toastShippingAddressSaved() {
  toast.success("Адресу доставки успішно оновлено!");
}

export function toastCompareAdded(productId: number, productName: string) {
  toast.success(`Додано до порівняння: ${productName}`, { id: `compare-add-${productId}` });
}

export function toastCompareRemoved(productId: number, productName: string) {
  toast.success(`Видалено з порівняння: ${productName}`, { id: `compare-remove-${productId}` });
}

export function toastCompareLimitReached() {
  toast.error("Можна порівняти не більше 4 товарів", { id: "compare-limit" });
}

export function toastSupportReplySent() {
  toast.success("Відповідь успішно надіслана");
}

export function toastPasswordResetCodeSent() {
  toast.success("Якщо обліковий запис існує, код надіслано на вашу пошту");
}

export function toastPasswordResetSuccess() {
  toast.success("Пароль успішно змінено");
}
