"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Check, Clock, Sparkles, X } from "lucide-react";

export function AdminServicesManager({
  initialServices,
  categories,
}: {
  initialServices: any[];
  categories: any[];
}) {
  const [services, setServices] = useState(initialServices);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [price, setPrice] = useState(1499);
  const [discountedPrice, setDiscountedPrice] = useState<number | "">("");
  const [image, setImage] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const openCreateModal = () => {
    setEditingService(null);
    setName("");
    setCategoryId(categories[0]?.id || "");
    setDescription("");
    setDurationMinutes(45);
    setPrice(1499);
    setDiscountedPrice("");
    setImage("https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&q=80");
    setIsPopular(false);
    setShowModal(true);
  };

  const openEditModal = (s: any) => {
    setEditingService(s);
    setName(s.name);
    setCategoryId(s.categoryId);
    setDescription(s.description);
    setDurationMinutes(s.durationMinutes);
    setPrice(s.price);
    setDiscountedPrice(s.discountedPrice || "");
    setImage(s.image || "");
    setIsPopular(s.isPopular);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingService) {
        // Update
        const res = await fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingService.id,
            name,
            categoryId,
            description,
            durationMinutes,
            price,
            discountedPrice: discountedPrice || null,
            image,
            isPopular,
            isActive: true,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          const categoryObj = categories.find((c) => c.id === categoryId);
          setServices((prev) =>
            prev.map((s) => (s.id === editingService.id ? { ...data.service, category: categoryObj } : s))
          );
          setShowModal(false);
        }
      } else {
        // Create
        const res = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            categoryId,
            description,
            durationMinutes,
            price,
            discountedPrice: discountedPrice || null,
            image,
            isPopular,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          const categoryObj = categories.find((c) => c.id === categoryId);
          setServices((prev) => [{ ...data.service, category: categoryObj }, ...prev]);
          setShowModal(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await fetch(`/api/admin/services?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
            Services &amp; Treatment Menu CRUD
          </h1>
          <p className="text-xs text-brand-muted">
            Manage salon services, pricing, durations, and category assignments
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7FD] dark:bg-purple-950/40 text-[11px] font-bold uppercase tracking-wider text-brand-muted border-b border-purple-100 dark:border-purple-900">
              <tr>
                <th className="p-4">Service</th>
                <th className="p-4">Category</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Price (INR)</th>
                <th className="p-4">Popular</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 dark:divide-purple-900">
              {services.map((svc) => (
                <tr key={svc.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <Image
                          src={svc.image || "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=100&q=80"}
                          alt={svc.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-brand-ink dark:text-white">{svc.name}</p>
                        <p className="text-[11px] text-brand-muted line-clamp-1 max-w-xs">{svc.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-brand-deep dark:text-brand-orchid">
                    {svc.category?.name || "Uncategorized"}
                  </td>
                  <td className="p-4">{svc.durationMinutes} mins</td>
                  <td className="p-4 font-bold text-brand-ink dark:text-white">
                    ₹{svc.price.toLocaleString("en-IN")}
                    {svc.discountedPrice && (
                      <span className="text-[11px] text-emerald-600 block">
                        (Sale: ₹{svc.discountedPrice})
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {svc.isPopular ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Yes
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[11px]">No</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(svc)}
                      aria-label="Edit Service"
                      className="p-1.5 rounded-lg border border-purple-200 text-brand-violet hover:bg-purple-50"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(svc.id)}
                      aria-label="Delete Service"
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 sm:p-8 max-w-lg w-full border border-purple-200 dark:border-purple-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-2xl font-bold text-brand-ink dark:text-white">
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-brand-muted hover:text-brand-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-brand-muted">Service Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Keratin Gloss Treatment"
                  className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">Duration (Minutes) *</label>
                  <input
                    type="number"
                    required
                    min={15}
                    step={15}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                    className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">Standard Price (INR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">Discounted Price (Optional)</label>
                  <input
                    type="number"
                    min={0}
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(e.target.value === "" ? "" : parseFloat(e.target.value))}
                    placeholder="Leave empty if regular"
                    className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-muted">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="In-depth face-shape consultation..."
                  className="w-full mt-1 rounded-xl border border-purple-200 p-2 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-brand-muted">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full mt-1 rounded-xl border border-purple-200 p-2 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popularCheck"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="h-4 w-4 accent-brand-violet rounded"
                />
                <label htmlFor="popularCheck" className="text-xs font-semibold text-brand-ink dark:text-white">
                  Mark as Popular / Featured Service on Homepage
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-purple-100 dark:border-purple-900">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-full border border-purple-200 text-xs font-semibold text-brand-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
