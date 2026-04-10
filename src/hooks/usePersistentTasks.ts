import { useCallback, useEffect, useState } from 'react'
import type { Task, TaskStatus } from '../types/task'

const STORAGE_KEY = 'interview-todo-tasks-v2'
const LEGACY_STORAGE_KEY = 'interview-todo-tasks'

function isTaskV2(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false
  const o = value as Record<string, unknown>
  const statusOk =
    o.status === 'pending' ||
    o.status === 'in_progress' ||
    o.status === 'completed'
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.description === 'string' &&
    statusOk &&
    typeof o.createdAt === 'string'
  )
}

function migrateLegacyTask(value: unknown): Task | null {
  if (!value || typeof value !== 'object') return null
  const o = value as Record<string, unknown>
  if (typeof o.id !== 'string' || typeof o.title !== 'string') return null
  const completed = Boolean(o.completed)
  return {
    id: o.id,
    title: String(o.title),
    description: typeof o.description === 'string' ? o.description : '',
    status: completed ? 'completed' : 'pending',
    createdAt:
      typeof o.createdAt === 'string' ? o.createdAt : new Date().toISOString(),
  }
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      return parsed.filter(isTaskV2)
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacy) {
      const parsed: unknown = JSON.parse(legacy)
      if (Array.isArray(parsed)) {
        const migrated = parsed
          .map(migrateLegacyTask)
          .filter((t): t is Task => t !== null)
        if (migrated.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
        }
        return migrated
      }
    }
    return []
  } catch {
    return []
  }
}

function persistTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Quota or private mode
  }
}

export type TaskInput = {
  title: string
  description: string
  status?: TaskStatus
}

export function usePersistentTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)

  useEffect(() => {
    persistTasks(tasks)
  }, [tasks])

  const addTask = useCallback((input: TaskInput) => {
    const title = input.title.trim()
    if (!title) return false
    const description = input.description.trim()
    const status = input.status ?? 'pending'
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        description,
        status,
        createdAt: new Date().toISOString(),
      },
    ])
    return true
  }, [])

  const updateTask = useCallback((id: string, input: TaskInput) => {
    const title = input.title.trim()
    if (!title) return false
    const description = input.description.trim()
    const status = input.status
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        return {
          ...t,
          title,
          description,
          ...(status !== undefined ? { status } : {}),
        }
      }),
    )
    return true
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { tasks, addTask, updateTask, deleteTask }
}
