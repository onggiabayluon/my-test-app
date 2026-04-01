"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import type { Class, Student } from "@/lib/types/lms";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ClassesPage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Registration modal state
  const [registerModal, setRegisterModal] = useState<{ classId: string; className: string } | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [registerStatus, setRegisterStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [registering, setRegistering] = useState(false);

  const fetchClasses = useCallback(async (day: string) => {
    setLoadingClasses(true);
    try {
      const res = await fetch(`/api/classes?day=${day}`);
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch {
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses(selectedDay);
  }, [selectedDay, fetchClasses]);

  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => setStudents(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const openRegister = (cls: Class) => {
    setRegisterModal({ classId: cls.id, className: cls.name });
    setSelectedStudentId("");
    setRegisterStatus(null);
  };

  const handleRegister = async () => {
    if (!registerModal || !selectedStudentId) return;
    setRegistering(true);
    setRegisterStatus(null);

    try {
      const res = await fetch(`/api/classes/${registerModal.classId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: selectedStudentId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setRegisterStatus({ type: "error", message: data.error ?? "Registration failed" });
      } else {
        setRegisterStatus({ type: "success", message: "Student registered successfully!" });
        fetchClasses(selectedDay);
      }
    } catch {
      setRegisterStatus({ type: "error", message: "Network error" });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <h1 className="text-2xl font-bold mb-6">Weekly Class Schedule</h1>

      {/* Day tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedDay === day
                ? "bg-primary text-primary-foreground"
                : "border hover:bg-accent"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Classes table */}
      {loadingClasses ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : classes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No classes on {selectedDay}.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Class</th>
                <th className="text-left px-4 py-3 font-medium">Subject</th>
                <th className="text-left px-4 py-3 font-medium">Time</th>
                <th className="text-left px-4 py-3 font-medium">Teacher</th>
                <th className="text-left px-4 py-3 font-medium">Capacity</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{cls.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{cls.subject}</td>
                  <td className="px-4 py-3">{cls.time_slot}</td>
                  <td className="px-4 py-3">{cls.teacher_name}</td>
                  <td className="px-4 py-3">max {cls.max_students}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openRegister(cls)}
                      className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                      Register
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Registration modal */}
      {registerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl border shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Register Student</h2>
              <button onClick={() => setRegisterModal(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Class: <span className="font-medium text-foreground">{registerModal.className}</span>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Student</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                <option value="">Choose a student...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.current_grade ? `— ${s.current_grade}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {registerStatus && (
              <div className={`rounded-lg px-4 py-3 text-sm mb-4 ${registerStatus.type === "success" ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200" : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"}`}>
                {registerStatus.message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setRegisterModal(null)}
                className="flex-1 border rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRegister}
                disabled={!selectedStudentId || registering}
                className="flex-1 bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {registering ? "Registering..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
