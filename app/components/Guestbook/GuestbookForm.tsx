"use client";

import { GuestbookEntry } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface GuestbookFormProps {
  editingEntry: GuestbookEntry | null;
  onSubmit: (name: string, message: string) => Promise<void>;
  submitting: boolean;
}

export default function GuestbookForm({
  editingEntry,
  onSubmit,
  submitting,
}: GuestbookFormProps) {
  const [formData, setFormData] = useState({
    name: editingEntry?.name || "",
    message: editingEntry?.message || "",
  });

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        name: editingEntry.name,
        message: editingEntry.message,
      });
    } else {
      setFormData({
        name: "",
        message: "",
      });
    }
  }, [editingEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData.name, formData.message);
  };

  return (
    <div className="space-y-4">
      {editingEntry && (
        <h3 className="text-lg font-semibold text-white">editing signature</h3>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          maxLength={30}
          className="w-full px-3 py-2 bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400"
          placeholder="what's your name?"
          required
        />

        <textarea
          id="message"
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          maxLength={30}
          rows={2}
          className="w-full px-3 py-2 bg-transparent border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 resize-none"
          placeholder="what do you want to say?"
          required
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 border border-gray-600 text-white hover:border-gray-400 disabled:opacity-50"
          >
            {submitting ? "saving..." : editingEntry ? "update" : "sign"}
          </button>
        </div>
      </form>
    </div>
  );
}
