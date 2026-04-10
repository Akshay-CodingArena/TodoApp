import { useCallback, useMemo, useState } from 'react'
import type { Task, TaskStatus } from '../types/task'
import { STATUS_LABELS, STATUS_ORDER } from '../types/task'
import { TaskCard } from './TaskCard'
import './TaskAccordion.css'

type Props = {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const defaultOpen: Record<TaskStatus, boolean> = {
  in_progress: true,
  pending: false,
  completed: false,
}

export function TaskAccordion({ tasks, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState<Record<TaskStatus, boolean>>(defaultOpen)

  const grouped = useMemo(() => {
    const g: Record<TaskStatus, Task[]> = {
      pending: [],
      in_progress: [],
      completed: [],
    }
    for (const t of tasks) {
      g[t.status].push(t)
    }
    return g
  }, [tasks])

  const toggle = useCallback((status: TaskStatus) => {
    setOpen((prev) => ({ ...prev, [status]: !prev[status] }))
  }, [])

  return (
    <div className="task-accordion">
      {STATUS_ORDER.map((status) => {
        const list = grouped[status]
        const count = list.length
        const isOpen = open[status]

        return (
          <section key={status} className="accordion-section">
            <button
              type="button"
              className="accordion-section__header"
              onClick={() => toggle(status)}
              aria-expanded={isOpen}
            >
              <span className="accordion-section__title">
                {STATUS_LABELS[status]}{' '}
                <span className="accordion-section__count">(<b>{count}</b>)</span>
              </span>
              <span
                className={`accordion-section__chev${isOpen ? ' accordion-section__chev--open' : ''}`}
                aria-hidden
              >
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path fill="currentColor"  d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                </svg>
              </span>
            </button>
            <div
              className={`accordion-section__panel${isOpen ? ' accordion-section__panel--open' : ''}`}
              aria-hidden={!isOpen}
            >
              <div className="accordion-section__inner">
                {list.length === 0 ? (
                  <p className="accordion-section__empty">No tasks in this group.</p>
                ) : (
                  <ul className="accordion-section__list">
                    {list.map((task) => (
                      <li key={task.id} className="accordion-section__item">
                        <TaskCard
                          task={task}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
