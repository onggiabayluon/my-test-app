'use client'
import { useState, useMemo } from "react";
import { Bell, Settings, Plus, Search, ClipboardList, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const MOCK_LOGS: BehavioralLog[] = [
  {
    id: "1",
    timestamp: "10:30 AM",
    severity: "High Severity",
    category: "School",
    title: "Verbal Aggression toward Peer",
    description:
      "Student exhibited elevated volume and used derogatory language during a group project transition. Required 1:1 intervention in the quiet room.",
    date: "Today",
  },
  {
    id: "2",
    timestamp: "09:15 AM",
    severity: "Positive Behavior",
    category: "Home",
    title: "Self-Initiated Regulation",
    description:
      "Recognized early signs of frustration during homework and independently requested a 5-minute sensory break without prompting.",
    date: "Today",
  },
  {
    id: "3",
    timestamp: "08:45 AM",
    severity: "Low Severity",
    category: "Social",
    title: "Minor Disengagement",
    description: "Head on desk during morning assembly. Responded to redirection within 30 seconds.",
    date: "Today",
  },
  {
    id: "4",
    timestamp: "04:20 PM",
    severity: "Medium Severity",
    category: "School",
    title: "Refusal of Task",
    description:
      'Adamantly refused to participate in the physical education session. Stated it was "too loud." Modified plan provided.',
    date: "Yesterday",
  },
  {
    id: "5",
    timestamp: "02:15 PM",
    severity: "Positive Behavior",
    category: "Social",
    title: "Pro-Social Peer Support",
    description:
      "Observed offering assistance to a younger student who dropped their books in the hallway. Significant progress in empathy metrics.",
    date: "Yesterday",
  },
  {
    id: "6",
    timestamp: "11:00 AM",
    severity: "High Severity",
    category: "Home",
    title: "Property Destruction",
    description:
      "Damaged personal electronic device following parental limit setting. Elevated emotional dysregulation lasted 45 minutes.",
    date: "Yesterday",
  },
];

import { LucideIcon } from "lucide-react";

export type Severity = "High Severity" | "Medium Severity" | "Low Severity" | "Positive Behavior";
export type Category = "School" | "Home" | "Social";

export interface BehavioralLog {
  id: string;
  timestamp: string;
  severity: Severity;
  category: Category;
  title: string;
  description: string;
  date: "Today" | "Yesterday";
}

export interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
}

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-100">
    <div className="flex justify-between items-center px-8 py-3 max-w-[1440px] mx-auto">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tight text-[#0040a1]">Clinical Precision</span>
        <div className="hidden md:flex gap-6 items-center">
          <a className="text-[#0040a1] font-semibold border-b-2 border-[#0040a1] pb-1" href="#">
            Dashboard
          </a>
          <a className="text-slate-500 hover:text-[#0040a1] transition-colors" href="#">
            Students
          </a>
          <a className="text-slate-500 hover:text-[#0040a1] transition-colors" href="#">
            Reports
          </a>
          <a className="text-slate-500 hover:text-[#0040a1] transition-colors" href="#">
            Team
          </a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-50 rounded-lg transition-all active:scale-95">
            <Bell className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 hover:bg-slate-50 rounded-lg transition-all active:scale-95">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <button className="bg-[#0040a1] text-white px-4 py-2 rounded-xl font-medium active:scale-95 transition-transform hover:bg-[#0056d2]">
          New Log
        </button>
        <img
          alt="Practitioner Profile"
          className="w-10 h-10 rounded-full object-cover border border-slate-200"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUhrfZW07TSB7uWQ1NM1af5odBmirjNzzRTKSWK2mojAmve-pmG9l0hFIcv3IrEXdfxxgF7EKZi3BJHlgSernZUuyZyq392MQaVNIdqipeuf6gmSZGALwhb0QoHKhV0lQqWe1Ho-4wk99OQ7uBPON6kAd6YP1nWwQdKhqly4EYWLd-AFlFejJownQhNv0a8A-fcHOJ80Uq_9YokL2iq9NTQX7_Z4iTcQAsnrVtQqqavDvhGHIk1Uu-tM4_B2gsGEpXojXkyzbT2E8"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  </nav>
);

const StatCard = ({ label, value, icon: Icon, color, bgColor, borderColor }: any) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={`bg-white p-6 rounded-2xl flex items-center justify-between border-l-4 ${borderColor} shadow-sm`}
  >
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className={`text-3xl font-bold mt-1 ${color}`}>{value}</h3>
    </div>
    <div className={`${bgColor} p-3 rounded-full`}>
      <Icon className={`w-8 h-8 ${color}`} />
    </div>
  </motion.div>
);

const LogItem = ({ log }: any) => {
  const getSeverityStyles = (severity: Severity) => {
    switch (severity) {
      case "High Severity":
        return {
          border: "border-l-[#ba1b20]",
          tagBg: "bg-[#ffdad6]",
          tagText: "text-[#930010]",
        };
      case "Medium Severity":
        return {
          border: "border-l-[#0056d2]",
          tagBg: "bg-[#dae2ff]",
          tagText: "text-[#0040a1]",
        };
      case "Low Severity":
        return {
          border: "border-l-slate-300",
          tagBg: "bg-slate-100",
          tagText: "text-slate-600",
        };
      case "Positive Behavior":
        return {
          border: "border-l-[#1b6d24]",
          tagBg: "bg-[#a3f69c]",
          tagText: "text-[#005312]",
        };
    }
  };

  const styles = getSeverityStyles(log.severity);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ x: 4 }}
      className={`bg-white p-5 rounded-2xl border-l-8 ${styles.border} flex gap-6 items-start transition-all cursor-pointer shadow-sm hover:shadow-md`}
    >
      <div className="flex flex-col items-center min-w-[85px]">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.timestamp}</span>
        <div className="h-full w-px bg-slate-100 my-2"></div>
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span
            className={`px-3 py-1 ${styles.tagBg} ${styles.tagText} text-[10px] font-bold rounded-full uppercase tracking-tight`}
          >
            {log.severity}
          </span>
          <span className="text-sm font-semibold text-[#0040a1]">{log.category}</span>
        </div>
        <h4 className="font-bold text-slate-900 text-lg mb-1">{log.title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed">{log.description}</p>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [severityFilter, setSeverityFilter] = useState("All Severities");

  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter((log) => {
      const matchesSearch =
        log.title.toLowerCase().includes(search.toLowerCase()) ||
        log.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All Categories" || log.category === categoryFilter;
      const matchesSeverity = severityFilter === "All Severities" || log.severity === severityFilter;
      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [search, categoryFilter, severityFilter]);

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-slate-900 font-sans">
      <Navbar />

      <main className="pt-24 pb-24 px-8 max-w-[1440px] mx-auto flex flex-col gap-10">
        <header>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2"
          >
            Teen Behavioral Logs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl"
          >
            Real-time monitoring and analysis of clinical behavioral patterns. Prioritize interventions based on
            severity and historical trends.
          </motion.p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Logs"
            value="1,284"
            icon={ClipboardList}
            color="text-[#0040a1]"
            bgColor="bg-[#dae2ff]"
            borderColor="border-[#0040a1]"
          />
          <StatCard
            label="Critical Alerts"
            value="12"
            icon={AlertCircle}
            color="text-[#940010]"
            bgColor="bg-[#ffdad6]"
            borderColor="border-[#940010]"
          />
          <StatCard
            label="Positive Behaviors"
            value="84"
            icon={CheckCircle2}
            color="text-[#1b6d24]"
            bgColor="bg-[#a3f69c]"
            borderColor="border-[#1b6d24]"
          />
        </section>

        <section className="bg-slate-50 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-white border-0 rounded-xl focus:ring-2 focus:ring-[#0040a1] text-slate-900 placeholder:text-slate-400 shadow-sm"
              placeholder="Search by student or keyword..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select
              className="bg-white border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#0040a1] min-w-[160px] shadow-sm cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>All Categories</option>
              <option>School</option>
              <option>Home</option>
              <option>Social</option>
            </select>
            <select
              className="bg-white border-0 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#0040a1] min-w-[160px] shadow-sm cursor-pointer"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option>All Severities</option>
              <option>Low Severity</option>
              <option>Medium Severity</option>
              <option>High Severity</option>
              <option>Positive Behavior</option>
            </select>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-bold text-slate-900">Recent Activity Feed</h2>
            <div className="flex items-center gap-2 text-[#0040a1] font-medium text-sm cursor-pointer group">
              <span className="group-hover:underline">View full history</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {filteredLogs.map((log) => (
                <LogItem key={log.id} log={log} />
              ))}
              {filteredLogs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200"
                >
                  <p className="text-slate-400 font-medium">No logs found matching your criteria.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-[#0040a1] text-white px-6 py-4 rounded-full shadow-2xl hover:bg-[#0056d2] transition-colors"
        >
          <Plus className="w-6 h-6" />
          <span className="font-bold">Add New Behavioral Log</span>
        </motion.button>
      </div>
    </div>
  );
}
