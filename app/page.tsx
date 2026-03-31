'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pencil, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal, 
  Plus,
  X,
  Check
} from 'lucide-react';


export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'wont-do';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  emoji: string;
}


const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Task in Progress',
    description: 'Working on project assets',
    status: 'in-progress',
    emoji: '⏰'
  },
  {
    id: '2',
    title: 'Task Completed',
    description: 'Morning exercise routine',
    status: 'completed',
    emoji: '🏃'
  },
  {
    id: '3',
    title: 'Task Won\'t Do',
    description: 'Skip afternoon coffee break',
    status: 'wont-do',
    emoji: '☕'
  },
  {
    id: '4',
    title: 'Task To Do',
    description: 'Read 20 pages of new book',
    status: 'todo',
    emoji: '📚'
  }
];

const STATUS_CONFIG: Record<TaskStatus, {
  bg: string;
  hover: string;
  text: string;
  iconBg: string;
  icon: React.ElementType;
  iconColor?: string;
}> = {
  'in-progress': {
    bg: 'bg-primary-container',
    hover: 'hover:bg-primary-container/80',
    text: 'text-on-primary-container',
    iconBg: 'bg-primary',
    icon: RefreshCw,
  },
  'completed': {
    bg: 'bg-secondary-container',
    hover: 'hover:bg-secondary-container/80',
    text: 'text-on-secondary-container',
    iconBg: 'bg-secondary',
    icon: CheckCircle2,
  },
  'wont-do': {
    bg: 'bg-tertiary-container',
    hover: 'hover:bg-tertiary-container/80',
    text: 'text-on-tertiary-container',
    iconBg: 'bg-tertiary',
    icon: XCircle,
  },
  'todo': {
    bg: 'bg-surface-container-high',
    hover: 'hover:bg-surface-container-highest',
    text: 'text-on-surface-variant',
    iconBg: 'bg-transparent border-2 border-outline-variant',
    icon: MoreHorizontal,
    iconColor: 'text-on-surface-variant'
  }
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', emoji: '📝' });

  const addTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Math.random().toString(36).substring(7),
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      emoji: newTask.emoji || '📝'
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', emoji: '📝' });
    setIsAdding(false);
  };

  const cycleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const statuses: TaskStatus[] = ['todo', 'in-progress', 'completed', 'wont-do'];
        const currentIndex = statuses.indexOf(t.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        return { ...t, status: statuses[nextIndex] };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
      <main className="max-w-4xl w-full">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-surface">
              My Task Board
            </h1>
            <Pencil className="w-10 h-10 text-primary" />
          </div>
          <p className="text-lg text-on-surface-variant font-medium">
            Tasks to keep organised
          </p>
        </header>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => {
              const config = STATUS_CONFIG[task.status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group flex items-center justify-between p-4 ${config.bg} ${config.hover} rounded-2xl transition-all cursor-pointer`}
                  onClick={() => cycleStatus(task.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-container-lowest rounded-xl flex items-center justify-center shadow-sm text-2xl">
                      {task.emoji}
                    </div>
                    <div>
                      <h3 className={`font-headline font-bold ${config.text}`}>
                        {task.title}
                      </h3>
                      <p className={`text-sm ${config.text} opacity-70 font-medium`}>
                        {task.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-black hover:bg-black/5 rounded-full transition-opacity"
                    >
                      <X className="w-5 h-5 text-on-surface-variant" />
                    </button>
                    <div className={`${config.iconBg} ${config.iconColor || 'text-white'} rounded-full p-2 flex items-center justify-center`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isAdding ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 p-6 bg-surface-container-low border-2 border-outline-variant rounded-2xl"
            >
              <div className="flex gap-4 mb-4">
                <input 
                  type="text" 
                  placeholder="Emoji (e.g. 🚀)"
                  className="w-20 p-3 bg-surface-container-lowest rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-center text-2xl"
                  value={newTask.emoji}
                  onChange={e => setNewTask({...newTask, emoji: e.target.value})}
                />
                <div className="flex-1 space-y-2">
                  <input 
                    type="text" 
                    placeholder="Task Title"
                    className="w-full p-3 bg-surface-container-lowest rounded-xl border-none focus:ring-2 focus:ring-primary outline-none font-bold"
                    value={newTask.title}
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                    autoFocus
                  />
                  <input 
                    type="text" 
                    placeholder="Task Description"
                    className="w-full p-3 bg-surface-container-lowest rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-sm"
                    value={newTask.description}
                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2 rounded-full font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={addTask}
                  className="px-6 py-2 signature-gradient rounded-full font-bold text-white shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save Task
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              layout
              onClick={() => setIsAdding(true)}
              className="mt-12 group p-6 bg-surface-container-low border-2 border-dashed border-outline-variant/50 rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-surface-container transition-all cursor-pointer active:scale-[0.99]"
            >
              <div className="w-12 h-12 signature-gradient rounded-full flex items-center justify-center  shadow-lg shadow-primary/20">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-headline font-bold text-on-surface-variant">Add new task</span>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
