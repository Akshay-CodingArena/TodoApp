export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  createdAt: string
}

export const STATUS_ORDER: TaskStatus[] = [
  'in_progress',
  'pending',
  'completed',
]

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
}
