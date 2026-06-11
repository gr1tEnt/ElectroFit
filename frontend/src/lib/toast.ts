import toast from "react-hot-toast";

export function toastAddedToCart(productName: string) {
  toast.success(`Added to cart: ${productName}`);
}

export function toastAddedSet(label: string) {
  toast.success(`Added to cart: ${label}`);
}
