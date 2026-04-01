"use client";

import { Pencil } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
      <main className="max-w-4xl w-full">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-surface">
              My Example App
            </h1>
            <Pencil className="w-10 h-10 text-primary" />
          </div>
          <p className="text-lg text-on-surface-variant font-medium">Tasks to keep organised</p>
        </header>
      </main>
    </div>
  );
}
