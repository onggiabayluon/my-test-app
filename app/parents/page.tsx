"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ParentsPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/parents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data.error ?? "Something went wrong" });
      } else {
        setStatus({ type: "success", message: `Parent "${data.name}" created successfully!` });
        setForm({ name: "", phone: "", email: "" });
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

      <h1 className="text-2xl font-bold mb-6">Add Parent</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nguyen Van An"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="0901234567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="parent@example.com"
          />
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
          {loading ? "Creating..." : "Create Parent"}
        </button>
      </form>
    </div>
  );
}
