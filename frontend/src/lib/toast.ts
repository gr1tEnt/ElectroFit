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
