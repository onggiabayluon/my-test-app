export type TaskStatus = "todo" | "in_progress" | "completed" | "wont_do";

export interface Board {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  board_id: string;
  name: string;
  description: string | null;
  icon: string;
  status: TaskStatus;
  created_at: string;
}

export type BoardInsert = Omit<Board, "id" | "created_at">;
export type BoardUpdate = Partial<BoardInsert>;

export type TaskInsert = Omit<Task, "id" | "created_at">;
export type TaskUpdate = Partial<Omit<TaskInsert, "board_id">>;
