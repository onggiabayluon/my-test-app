export interface Parent {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface Student {
  id: string;
  name: string;
  dob: string | null;
  gender: string | null;
  current_grade: string | null;
  parent_id: string | null;
  created_at: string;
}

export interface StudentWithParent extends Student {
  parent: Parent | null;
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  day_of_week: string;
  time_slot: string;
  teacher_name: string;
  max_students: number;
  created_at: string;
}

export interface ClassRegistration {
  id: string;
  class_id: string;
  student_id: string;
  registered_at: string;
}

export interface Subscription {
  id: string;
  student_id: string;
  package_name: string;
  start_date: string;
  end_date: string;
  total_sessions: number;
  used_sessions: number;
  created_at: string;
}

export type ParentInsert = Omit<Parent, "id" | "created_at">;
export type StudentInsert = Omit<Student, "id" | "created_at">;
export type ClassInsert = Omit<Class, "id" | "created_at">;
export type SubscriptionInsert = Omit<Subscription, "id" | "created_at">;
