"use client";

import Link from "next/link";
import { Users, GraduationCap, BookOpen } from "lucide-react";

const navItems = [
  {
    href: "/parents",
    icon: Users,
    label: "Parents",
    description: "Add and manage parent profiles",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950",
  },
  {
    href: "/students",
    icon: GraduationCap,
    label: "Students",
    description: "Add students and link to parents",
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950",
  },
  {
    href: "/classes",
    icon: BookOpen,
    label: "Classes",
    description: "Browse weekly schedule and register students",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
      <main className="max-w-3xl w-full">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">TeenUp LMS</h1>
          <p className="text-lg text-muted-foreground">Student & class management mini app</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {navItems.map(({ href, icon: Icon, label, description, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="block rounded-xl border p-6 hover:shadow-md transition-shadow"
            >
              <div className={`inline-flex p-3 rounded-lg mb-4 ${bg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h2 className="font-semibold text-lg mb-1">{label}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
