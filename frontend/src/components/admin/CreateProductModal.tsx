"use client";

import { createProduct } from "@/lib/adminApi";
import {
  IP_RATING_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  ROOM_TYPE_OPTIONS,
  type CreateProductPayload,
} from "@/types/admin";
import type { ProductType } from "@/types/product";
import { useState } from "react";

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const defaultForm: CreateProductPayload = {
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
  compatibleRoomTypes: ["BEDROOM"],
};

export function CreateProductModal({ open, onClose, onCreated }: CreateProductModalProps) {
  const [form, setForm] = useState<CreateProductPayload>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const toggleRoom = (room: string) => {
    setForm((prev) => {
      const rooms = prev.compatibleRoomTypes.includes(room)
        ? prev.compatibleRoomTypes.filter((r) => r !== room)
        : [...prev.compatibleRoomTypes, room];
      return { ...prev, compatibleRoomTypes: rooms };
    });
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
      await createProduct({
        ...form,
        price: Number(form.price),
        maxAmps: Number(form.maxAmps),
        framePostsCount:
          form.type === "FRAME" ? Number(form.framePostsCount) || 1 : undefined,
      });
      setForm(defaultForm);
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        role="dialog"
        aria-labelledby="create-product-title"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
          <h2 id="create-product-title" className="text-lg font-semibold text-white">
            Create product
          </h2>
          <button
            type="button"
            onClick={onClose}
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
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as ProductType })
                  }
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
                <input
                  required
                  value={form.categoryName}
                  onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                  placeholder="Sockets, Frames, Switches…"
                  className={inputClass}
                />
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

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-400">
              Technical specs
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="IP rating" required>
                <select
                  value={form.ipRating}
                  onChange={(e) =>
                    setForm({ ...form, ipRating: e.target.value as CreateProductPayload["ipRating"] })
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
              {form.type === "FRAME" && (
                <Field label="Frame posts count">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={form.framePostsCount ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, framePostsCount: Number(e.target.value) })
                    }
                    className={inputClass}
                  />
                </Field>
              )}
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
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Create product"}
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
