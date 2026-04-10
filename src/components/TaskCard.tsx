import { type AnimationEvent, useState } from 'react'
import type { Task } from '../types/task'
import { STATUS_LABELS } from '../types/task'
import { formatTaskDate } from '../utils/formatDate'
import './TaskCard.css'

type Props = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: Props) {
  const [exiting, setExiting] = useState(false)

  function requestDelete() {
    setExiting(true)
  }

  function onAnimEnd(e: AnimationEvent<HTMLDivElement>) {
    if (exiting && e.animationName === 'taskCardExit') onDelete(task.id)
  }

  const desc = task.description.trim()

  return (
    <div
      className={`task-card${exiting ? ' task-card--exit' : ''}`}
      onAnimationEnd={onAnimEnd}
    >
      <div className="task-card__body">
        <div className="task-card__clock" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path
              fill="var(--primary)"
              d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
            />
          </svg>
        </div>

        <div className="task-card__main">
          <div className="task-card__row">
            <h3 className="task-card__title">{task.title}</h3>
            <span
              className={`task-card__badge task-card__badge--${task.status}`}
            >
              <span className="task-card__badge-dot" aria-hidden />
              {STATUS_LABELS[task.status]}
            </span>
          </div>
          <p className="task-card__desc">
            {desc ? (
              desc
            ) : (
              <span className="task-card__desc-placeholder">
                No description added.
              </span>
            )}
          </p>
          <p className="task-card__date">{formatTaskDate(task.createdAt)}</p>
        </div>
      </div>

      <div className="task-card__actions">
        <button
          type="button"
          className="task-card__icon-btn task-card__icon-btn--edit"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
            />
          </svg>
        </button>
        <button
          type="button"
          className="task-card__icon-btn task-card__icon-btn--delete"
          onClick={requestDelete}
          aria-label="Delete task"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
