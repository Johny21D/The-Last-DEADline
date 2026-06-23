export type Urgency = "overdue" | "critical" | "soon" | "upcoming" | "later";

export type Assignment = {
  id: string;
  title: string;
  course_name: string;
  due_at: string;
  user_id: string;
  completed: boolean;
};