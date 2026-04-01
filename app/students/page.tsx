"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Parent } from "@/lib/types/lms";

export default function StudentsPage() {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    current_grade: "",
    parent_id: "",
  });
  const [parents, setParents] = useState<Parent[]>([]);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/parents")
      .then((r) => r.json())
      .then(setParents)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          dob: form.dob || null,
          gender: form.gender || null,
          current_grade: form.current_grade || null,
          parent_id: form.parent_id || null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data.error ?? "Something went wrong" });
      } else {
        setStatus({ type: "success", message: `Student "${data.name}" created successfully!` });
        setForm({ name: "", dob: "", gender: "", current_grade: "", parent_id: "" });
      }
    } catch {
      setStatus({ type: "error", message: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-lg mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <h1 className="text-2xl font-bold mb-6">Add Student</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nguyen Minh Khoa"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Current Grade</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.current_grade}
            onChange={(e) => setForm({ ...form, current_grade: e.target.value })}
            placeholder="Grade 6"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Parent</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.parent_id}
            onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
          >
            <option value="">Select parent (optional)</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.phone ? `(${p.phone})` : ""}
              </option>
            ))}
          </select>
        </div>

        {status && (
          <div className={`rounded-lg px-4 py-3 text-sm ${status.type === "success" ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200" : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"}`}>
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? "Creating..." : "Create Student"}
        </button>
      </form>
    </div>
  );
}
