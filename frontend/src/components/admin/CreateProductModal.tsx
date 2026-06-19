"use client";

import { getErrorMessage } from "@/lib/apiError";
import { createProduct, updateProduct } from "@/lib/adminApi";
import { resolveProductImageUrl } from "@/lib/productUtils";
import {
  CATEGORY_OPTIONS,
  FRAME_POST_OPTIONS,
  IP_RATING_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  ROOM_TYPE_OPTIONS,
  type CreateProductPayload,
} from "@/types/admin";
import type { Product, ProductType } from "@/types/product";
import { useCallback, useEffect, useRef, useState } from "react";

interface CreateProductModalProps {
  open: boolean;
  editingProduct?: Product | null;
  onClose: () => void;
  onSaved: (updatedProduct?: Product) => void | Promise<void>;
}

interface FormState extends CreateProductPayload {
  material: string;
  dimensions: string;
}

const defaultForm: FormState = {
  sku: "",
  name: "",
  description: "",
  price: 0,
  type: "MECHANISM",
  lowVoltage: false,
  brandName: "",
  seriesName: "",
  categoryName: "Sockets",
  ipRating: "IP20",
  maxAmps: 16,
  hasChildProtection: false,
  hasGrounding: true,
  framePostsCount: 1,
  compatibleRoomTypes: ["BEDROOM"],
  material: "",
  dimensions: "",
};

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

function CloudUploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="mx-auto h-10 w-10 text-slate-500"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
      />
    </svg>
  );
}

export function CreateProductModal({
  open,
  editingProduct = null,
  onClose,
  onSaved,
}: CreateProductModalProps) {
  const isEditMode = editingProduct != null;
  const [form, setForm] = useState<FormState>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editingProductIdRef = useRef<number | null>(null);

  const resetForm = useCallback(() => {
    setForm(defaultForm);
    setImageFile(null);
    setExistingImageUrl(null);
    setPreviewUrl(null);
    setError(null);
    setDragActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const populateFromProduct = useCallback((product: Product) => {
    setForm(productToFormState(product));
    setImageFile(null);
    setExistingImageUrl(product.imageUrl ?? product.imageUrls?.[0] ?? null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  useEffect(() => {
    if (!open) {
      editingProductIdRef.current = null;
      resetForm();
      return;
    }

    if (editingProduct) {
      editingProductIdRef.current = editingProduct.id;
      populateFromProduct(editingProduct);
    } else {
      editingProductIdRef.current = null;
      resetForm();
    }
    // Only re-initialize when the modal opens or a different product is selected.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingProduct?.id]);

  if (!open) return null;

  const isFrame = form.type === "FRAME";

  const toggleRoom = (room: string) => {
    setForm((prev) => {
      const rooms = prev.compatibleRoomTypes.includes(room)
        ? prev.compatibleRoomTypes.filter((r) => r !== room)
        : [...prev.compatibleRoomTypes, room];
      return { ...prev, compatibleRoomTypes: rooms };
    });
  };

  const handleTypeChange = (type: ProductType) => {
    setForm((prev) => ({
      ...prev,
      type,
      categoryName: type === "FRAME" ? "Frames" : prev.categoryName,
      framePostsCount: type === "FRAME" ? prev.framePostsCount ?? 1 : undefined,
    }));
  };

  const applyImageFile = (file: File | null) => {
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Завантажте зображення у форматі PNG або JPG.");
      return;
    }
    setError(null);
    setImageFile(file);
    setExistingImageUrl(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files.item(0);
    applyImageFile(file);
  };

  const buildPayload = (): CreateProductPayload => {
    const detailedAttributes: Record<string, string> = {};
    if (form.material.trim()) detailedAttributes.Material = form.material.trim();
    if (form.dimensions.trim()) detailedAttributes.Dimensions = form.dimensions.trim();

    const payload: CreateProductPayload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      type: form.type,
      lowVoltage: form.lowVoltage,
      brandName: form.brandName.trim(),
      seriesName: form.seriesName.trim(),
      categoryName: form.categoryName,
      ipRating: form.ipRating,
      maxAmps: Number(form.maxAmps),
      hasChildProtection: form.hasChildProtection,
      hasGrounding: form.hasGrounding,
      framePostsCount: isFrame ? Number(form.framePostsCount) || 1 : undefined,
      compatibleRoomTypes: form.compatibleRoomTypes,
      detailedAttributes:
        Object.keys(detailedAttributes).length > 0 ? detailedAttributes : undefined,
    };

    if (!imageFile && existingImageUrl) {
      payload.imageUrl = existingImageUrl;
      payload.imageUrls =
        editingProduct?.imageUrls && editingProduct.imageUrls.length > 0
          ? editingProduct.imageUrls
          : [existingImageUrl];
    }

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (form.compatibleRoomTypes.length === 0) {
      setError("Оберіть принаймні один тип приміщення.");
      return;
    }
    const productId = editingProductIdRef.current;
    const editMode = productId != null;

    setSubmitting(true);
    setError(null);
    try {
      if (editMode) {
        const updated = await updateProduct(productId, buildPayload(), imageFile);
        await onSaved(normalizeProduct(updated));
      } else {
        const created = await createProduct(buildPayload(), imageFile);
        await onSaved(normalizeProduct(created));
      }
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, editMode ? "Не вдалося оновити товар" : "Не вдалося створити товар"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const imagePreviewSrc = previewUrl
    ? previewUrl
    : existingImageUrl
      ? resolveProductImageUrl(existingImageUrl)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        role="dialog"
        aria-labelledby="create-product-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
          <h2 id="create-product-title" className="text-lg font-semibold text-white">
            {isEditMode ? "Редагувати товар" : "Додати товар"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-white"
            aria-label="Закрити"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
          )}

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
              Зображення товару
            </h3>
            <p className="mt-1 text-xs text-slate-500">PNG або JPG, до 10 МБ.</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_140px]">
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition ${
                  dragActive
                    ? "cursor-pointer border-amber-400 bg-amber-500/10"
                    : "cursor-pointer border-slate-600 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/70"
                }`}
              >
                <CloudUploadIcon />
                <p className="mt-3 text-center text-sm font-medium text-slate-200">
                  {isEditMode ? "Натисніть, щоб замінити зображення, або перетягніть файл" : "Натисніть для завантаження або перетягніть файл"}
                </p>
                <p className="mt-1 text-center text-xs text-slate-500">PNG, JPG до 10 МБ</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={(e) => applyImageFile(e.target.files?.item(0) ?? null)}
                />
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                {imagePreviewSrc ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreviewSrc}
                      alt="Попередній перегляд товару"
                      className="h-28 w-full rounded-lg object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setExistingImageUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="mt-2 text-xs text-red-300 hover:text-red-200"
                    >
                      Видалити
                    </button>
                  </>
                ) : (
                  <p className="text-center text-xs text-slate-500">Попередній перегляд</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
              Основна інформація
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="SKU" required>
                <input
                  required
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Назва" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Ціна (€)" required>
                <input
                  required
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className={inputClass}
                />
              </Field>
              <Field label="Тип товару" required>
                <select
                  value={form.type}
                  onChange={(e) => handleTypeChange(e.target.value as ProductType)}
                  className={inputClass}
                >
                  {PRODUCT_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Категорія" required className="sm:col-span-2">
                <select
                  required
                  value={form.categoryName}
                  onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                  className={inputClass}
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Опис" className="sm:col-span-2">
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
              Бренд і серія
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Бренд" required>
                <input
                  required
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  placeholder="Legrand"
                  className={inputClass}
                />
              </Field>
              <Field label="Серія" required>
                <input
                  required
                  value={form.seriesName}
                  onChange={(e) => setForm({ ...form, seriesName: e.target.value })}
                  placeholder="Valena Life"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          {isFrame ? (
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
                Конфігурація рамки
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Пости рамки" required>
                  <select
                    required
                    value={form.framePostsCount ?? 1}
                    onChange={(e) =>
                      setForm({ ...form, framePostsCount: Number(e.target.value) })
                    }
                    className={inputClass}
                  >
                    {FRAME_POST_OPTIONS.map((count) => (
                      <option key={count} value={count}>
                        {count} {count === 1 ? "пост" : "постів"}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </section>
          ) : (
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
                Технічні характеристики
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Ступінь захисту IP" required>
                  <select
                    value={form.ipRating}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        ipRating: e.target.value as CreateProductPayload["ipRating"],
                      })
                    }
                    className={inputClass}
                  >
                    {IP_RATING_OPTIONS.map((ip) => (
                      <option key={ip} value={ip}>
                        {ip}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Макс. струм (А)" required>
                  <input
                    required
                    type="number"
                    min={1}
                    value={form.maxAmps}
                    onChange={(e) => setForm({ ...form, maxAmps: Number(e.target.value) })}
                    className={inputClass}
                  />
                </Field>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.hasChildProtection}
                    onChange={(e) =>
                      setForm({ ...form, hasChildProtection: e.target.checked })
                    }
                    className="rounded border-slate-600"
                  />
                  Захист від дітей
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.hasGrounding}
                    onChange={(e) => setForm({ ...form, hasGrounding: e.target.checked })}
                    className="rounded border-slate-600"
                  />
                  Заземлення
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.lowVoltage}
                    onChange={(e) => setForm({ ...form, lowVoltage: e.target.checked })}
                    className="rounded border-slate-600"
                  />
                  Низька напруга (SELV)
                </label>
              </div>
            </section>
          )}

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
              Детальні атрибути
            </h3>
            <p className="mt-1 text-xs text-slate-500">Необов&apos;язкові поля з технічного паспорта.</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Матеріал">
                <input
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                  placeholder="напр. термопластичний ABS"
                  className={inputClass}
                />
              </Field>
              <Field label="Розміри">
                <input
                  value={form.dimensions}
                  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                  placeholder="напр. 86 × 86 мм"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
              Сумісність з приміщеннями
            </h3>
            <p className="mt-1 text-xs text-slate-500">Використовується для рекомендацій Розумного підбору.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ROOM_TYPE_OPTIONS.map((room) => (
                <button
                  key={room.value}
                  type="button"
                  onClick={() => toggleRoom(room.value)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    form.compatibleRoomTypes.includes(room.value)
                      ? "border-amber-500 bg-amber-500/20 text-amber-300"
                      : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  {room.label}
                </button>
              ))}
            </div>
          </section>

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Обробка…" : isEditMode ? "Зберегти зміни" : "Додати товар"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  required,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-slate-400">
        {label}
        {required && " *"}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500";

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    price: Number(product.price),
  };
}

function productToFormState(product: Product): FormState {
  const attrs = product.detailedAttributes ?? {};
  const material =
    attrs.Material ?? attrs.material ?? Object.entries(attrs).find(([k]) => k.toLowerCase() === "material")?.[1] ?? "";
  const dimensions =
    attrs.Dimensions ??
    attrs.dimensions ??
    Object.entries(attrs).find(([k]) => k.toLowerCase() === "dimensions")?.[1] ??
    "";

  return {
    sku: product.sku,
    name: product.name,
    description: product.description ?? "",
    price: Number(product.price),
    type: product.type,
    lowVoltage: product.lowVoltage,
    brandName: product.brandName ?? "",
    seriesName: product.seriesName ?? "",
    categoryName: product.categoryName ?? "Sockets",
    ipRating: product.ipRating ?? product.technicalSpec?.ipRating ?? "IP20",
    maxAmps: product.maxAmps ?? product.technicalSpec?.maxAmps ?? 16,
    hasChildProtection:
      product.hasChildProtection ?? product.technicalSpec?.hasChildProtection ?? false,
    hasGrounding: product.hasGrounding ?? product.technicalSpec?.hasGrounding ?? true,
    framePostsCount: product.framePostsCount ?? product.technicalSpec?.framePostsCount ?? 1,
    compatibleRoomTypes:
      product.compatibleRoomTypes ?? product.technicalSpec?.compatibleRoomTypes ?? ["BEDROOM"],
    material,
    dimensions,
  };
}
