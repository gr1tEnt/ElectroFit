"use client";

import {
  loadSavedShippingAddress,
  saveSavedShippingAddress,
  type SavedShippingAddress,
} from "@/lib/shippingAddressStorage";
import { toastShippingAddressSaved } from "@/lib/toast";
import { useEffect, useState } from "react";

interface SavedShippingAddressCardProps {
  userEmail: string;
}

const emptyAddress: SavedShippingAddress = {
  streetAddress: "",
  city: "",
  phone: "",
};

export function SavedShippingAddressCard({ userEmail }: SavedShippingAddressCardProps) {
  const [form, setForm] = useState<SavedShippingAddress>(emptyAddress);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadSavedShippingAddress(userEmail);
    setForm(saved ?? emptyAddress);
  }, [userEmail]);

  const handleSave = () => {
    if (!form.streetAddress.trim()) {
      setError("Please enter your street address.");
      return;
    }
    if (!form.city.trim()) {
      setError("Please enter your city.");
      return;
    }
    if (!form.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      saveSavedShippingAddress(userEmail, form);
      toastShippingAddressSaved();
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">Saved Shipping Address</h2>
      <p className="mt-1 text-sm text-muted">
        Save your details once and they will be pre-filled at checkout.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="profile-street" className="block text-sm font-medium text-ink">
            Street address
          </label>
          <input
            id="profile-street"
            value={form.streetAddress}
            onChange={(e) => setForm({ ...form, streetAddress: e.target.value })}
            className={inputClass}
            placeholder="123 Main Street, Apt 4"
          />
        </div>
        <div>
          <label htmlFor="profile-city" className="block text-sm font-medium text-ink">
            City
          </label>
          <input
            id="profile-city"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className={inputClass}
            placeholder="Prague"
          />
        </div>
        <div>
          <label htmlFor="profile-phone" className="block text-sm font-medium text-ink">
            Phone number
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
            placeholder="+420 123 456 789"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Address"}
      </button>
    </section>
  );
}
