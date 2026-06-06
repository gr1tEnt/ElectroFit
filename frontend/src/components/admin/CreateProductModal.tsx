"use client";

import { getErrorMessage } from "@/lib/apiError";
import { createProduct } from "@/lib/adminApi";
import {
  CATEGORY_OPTIONS,
  FRAME_POST_OPTIONS,
  IP_RATING_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  ROOM_TYPE_OPTIONS,
  type CreateProductPayload,
} from "@/types/admin";
import type { ProductType } from "@/types/product";
import { useCallback, useEffect, useRef, useState } from "react";

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
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

export function CreateProductModal({ open, onClose, onCreated }: CreateProductModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setForm(defaultForm);
    setImageFile(null);
    setPreviewUrl(null);
    setError(null);
    setDragActive(false);
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
      resetForm();
    }
  }, [open, resetForm]);

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
      setError("Please upload a PNG or JPG image.");
      return;
    }
    setError(null);
    setImageFile(file);
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

    return {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.compatibleRoomTypes.length === 0) {
      setError("Select at least one compatible room type.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createProduct(buildPayload(), imageFile);
      resetForm();
      onCreated();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create product"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        role="dialog"
        aria-labelledby="create-product-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
          <h2 id="create-product-title" className="text-lg font-semibold text-white">
            Add New Product
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-white"
            aria-label="Close"
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
              Product image
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_140px]">
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
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
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition ${
                  dragActive
                    ? "border-amber-400 bg-amber-500/10"
                    : "border-slate-600 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/70"
                }`}
              >
                <CloudUploadIcon />
                <p className="mt-3 text-center text-sm font-medium text-slate-200">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-center text-xs text-slate-500">PNG, JPG up to 10 MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={(e) => applyImageFile(e.target.files?.item(0) ?? null)}
                />
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                {previewUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Product preview"
                      className="h-28 w-full rounded-lg object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="mt-2 text-xs text-red-300 hover:text-red-200"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <p className="text-center text-xs text-slate-500">Preview</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
              Basic info
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
              <Field label="Name" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Price (€)" required>
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
              <Field label="Product type" required>
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
              <Field label="Category" required className="sm:col-span-2">
                <select
                  required
                  value={form.categoryName}
                  onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                  className={inputClass}
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Description" className="sm:col-span-2">
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
              Brand & series
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Brand" required>
                <input
                  required
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  placeholder="Legrand"
                  className={inputClass}
                />
              </Field>
              <Field label="Series" required>
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
                Frame configuration
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Frame posts" required>
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
                        {count} {count === 1 ? "post" : "posts"}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </section>
          ) : (
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
                Technical specs
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="IP rating" required>
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
                <Field label="Max amps" required>
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
                  Child protection
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.hasGrounding}
                    onChange={(e) => setForm({ ...form, hasGrounding: e.target.checked })}
                    className="rounded border-slate-600"
                  />
                  Grounding
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.lowVoltage}
                    onChange={(e) => setForm({ ...form, lowVoltage: e.target.checked })}
                    className="rounded border-slate-600"
                  />
                  Low voltage (SELV)
                </label>
              </div>
            </section>
          )}

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
              Detailed attributes
            </h3>
            <p className="mt-1 text-xs text-slate-500">Optional datasheet fields.</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Material">
                <input
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                  placeholder="e.g. Thermoplastic ABS"
                  className={inputClass}
                />
              </Field>
              <Field label="Dimensions">
                <input
                  value={form.dimensions}
                  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                  placeholder="e.g. 86 × 86 mm"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
              Room compatibility
            </h3>
            <p className="mt-1 text-xs text-slate-500">Used for Smart Selector recommendations.</p>
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Add Product"}
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
