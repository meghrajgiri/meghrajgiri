"use client";

import { AdminAuth } from "@/components/admin/AdminAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";
import type { ContactSubmission } from "@/lib/supabase";
import { useEffect, useState } from "react";

function ContactsContent() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "replied">(
    "all",
  );

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id: string,
    status: "unread" | "read" | "replied",
  ) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status } : sub)),
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filtered =
    filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  const counts = {
    all: submissions.length,
    unread: submissions.filter((s) => s.status === "unread").length,
    read: submissions.filter((s) => s.status === "read").length,
    replied: submissions.filter((s) => s.status === "replied").length,
  };

  const statusStyles = {
    unread: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
    read: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    replied:
      "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-8 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Contact Submissions
        </h1>
        <button
          onClick={fetchSubmissions}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900"
        >
          Refresh
        </button>
      </div>

      <div className="p-8">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          {(
            [
              { key: "all", label: "Total", color: "text-gray-900 dark:text-gray-100" },
              { key: "unread", label: "Unread", color: "text-red-600 dark:text-red-400" },
              { key: "read", label: "Read", color: "text-amber-600 dark:text-amber-400" },
              { key: "replied", label: "Replied", color: "text-green-600 dark:text-green-400" },
            ] as const
          ).map((stat) => (
            <button
              key={stat.key}
              onClick={() => setFilter(stat.key)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                filter === stat.key
                  ? "border-gray-900 bg-gray-50 dark:border-gray-100 dark:bg-gray-900"
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700"
              }`}
            >
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-semibold ${stat.color}`}>
                {counts[stat.key]}
              </p>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">
            Loading submissions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No {filter === "all" ? "" : filter} submissions found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filtered.map((submission) => (
                  <tr
                    key={submission.id}
                    className="bg-white transition-colors hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[submission.status]}`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {submission.name}
                      </div>
                      <a
                        href={`mailto:${submission.email}`}
                        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {submission.email}
                      </a>
                    </td>
                    <td className="max-w-xs px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {submission.subject}
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        {submission.message}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(submission.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {submission.status !== "read" && (
                          <button
                            onClick={() => updateStatus(submission.id, "read")}
                            className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/50"
                          >
                            Mark Read
                          </button>
                        )}
                        {submission.status !== "replied" && (
                          <button
                            onClick={() =>
                              updateStatus(submission.id, "replied")
                            }
                            className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50"
                          >
                            Mark Replied
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContactsAdmin() {
  return (
    <AdminAuth>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        <AdminSidebar />
        <ContactsContent />
      </div>
    </AdminAuth>
  );
}
