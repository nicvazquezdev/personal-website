"use client";

import { useState, useEffect, useCallback } from "react";
import { GuestbookEntry } from "@/lib/supabase";
import {
  getSessionId,
  addGuestbookEntry,
  getGuestbookEntries,
  updateGuestbookEntry,
  deleteGuestbookEntry,
  checkIfUserHasSigned,
} from "@/lib/guestbook";
import GuestbookForm from "./Guestbook/GuestbookForm";
import GuestbookList from "./Guestbook/GuestbookList";
import GuestbookStatus from "./Guestbook/GuestbookStatus";

interface GuestbookProps {
  className?: string;
}

export default function Guestbook({ className = "" }: GuestbookProps) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<GuestbookEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sessionId = getSessionId();

  const loadEntries = useCallback(
    async (page: number = 0, append: boolean = false) => {
      try {
        setLoading(true);
        const { entries: newEntries, hasMore: moreEntries } =
          await getGuestbookEntries(page, 10);

        if (append) {
          setEntries((prev) => [...prev, ...newEntries]);
        } else {
          setEntries(newEntries);
        }

        setHasMore(moreEntries);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error loading entries:", error);
        setError("error loading signatures");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const checkUserStatus = useCallback(async () => {
    try {
      const signed = await checkIfUserHasSigned(sessionId);
      setHasSigned(signed);
    } catch (error) {
      console.error("Error checking user status:", error);
    }
  }, [sessionId]);

  useEffect(() => {
    loadEntries();
    checkUserStatus();
  }, [loadEntries, checkUserStatus]);

  const handleFormSubmit = async (name: string, message: string) => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (editingEntry) {
        const result = await updateGuestbookEntry(
          editingEntry.id,
          name,
          message,
          sessionId,
        );

        if (result.success) {
          setSuccess("signature updated successfully");
          setEditingEntry(null);
          loadEntries(0, false);
        } else {
          setError(result.error || "error updating signature");
        }
      } else {
        const result = await addGuestbookEntry(name, message, sessionId);

        if (result.success) {
          setSuccess("thanks for leaving your signature!");
          setShowForm(false);
          setHasSigned(true);
          loadEntries(0, false);
        } else {
          setError(result.error || "error saving signature");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("unexpected error. please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry: GuestbookEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm("are you sure you want to delete your signature?")) return;

    try {
      const result = await deleteGuestbookEntry(entryId, sessionId);

      if (result.success) {
        setSuccess("signature deleted successfully");
        setHasSigned(false);
        loadEntries(0, false);
      } else {
        setError(result.error || "error deleting signature");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      setError("unexpected error. please try again.");
    }
  };

  const handleLoadMore = () => {
    loadEntries(currentPage + 1, true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {!hasSigned && (
        <GuestbookForm
          editingEntry={editingEntry}
          onSubmit={handleFormSubmit}
          submitting={submitting}
        />
      )}

      <GuestbookStatus error={error} success={success} />

      <GuestbookList
        entries={entries}
        loading={loading}
        hasMore={hasMore}
        sessionId={sessionId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
