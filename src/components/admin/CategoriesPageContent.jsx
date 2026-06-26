"use client";

import { useState } from "react";

const emptyForm = { id: "", nameVi: "", nameEn: "" };

export default function CategoriesPageContent({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const refresh = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setForm(emptyForm);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ id: cat.id, nameVi: cat.nameVi, nameEn: cat.nameEn });
    setError("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameVi: form.nameVi, nameEn: form.nameEn }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setEditingId(null);
      setForm(emptyForm);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Delete category "${id}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500 mt-1">{categories.length} categories</p>
      </div>

      {/* Add / Edit form */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          {editingId ? `Edit: ${editingId}` : "Add new category"}
        </h2>
        <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-3">
          {!editingId && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">ID (slug)</label>
              <input
                required
                value={form.id}
                onChange={set("id")}
                placeholder="e.g. clutch"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Lowercase, no spaces. Used internally.</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Name (VI) *</label>
              <input
                required
                value={form.nameVi}
                onChange={set("nameVi")}
                placeholder="e.g. Túi Clutch"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Name (EN) *</label>
              <input
                required
                value={form.nameEn}
                onChange={set("nameEn")}
                placeholder="e.g. Clutch"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-brown text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-brown-light transition-colors disabled:opacity-50"
            >
              {loading ? "Saving…" : editingId ? "Update" : "Add category"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Category list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No categories yet. Add one above.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Vietnamese</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">English</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-400 font-mono text-xs">{cat.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{cat.nameVi}</td>
                  <td className="px-5 py-3 text-gray-600">{cat.nameEn}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-brand-brown hover:underline text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
