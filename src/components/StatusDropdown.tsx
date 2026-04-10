import { useEffect, useId, useRef, useState } from 'react'
import type { TaskStatus } from '../types/task'
import { STATUS_LABELS } from '../types/task'
import './StatusDropdown.css'

const OPTIONS: TaskStatus[] = ['pending', 'in_progress', 'completed']

type Props = {
  value: TaskStatus
  onChange: (status: TaskStatus) => void
  id?: string
}

export function StatusDropdown({ value, onChange, id }: Props) {
  const autoId = useId()
  const listId = id ?? `status-list-${autoId}`
  const btnId = `status-btn-${autoId}`
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className="status-dropdown" ref={rootRef}>
      <label className="status-dropdown__label" htmlFor={btnId}>
        Status
      </label>
      <button
        id={btnId}
        type="button"
        className="status-dropdown__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className={`status-dropdown__dot status-dropdown__dot--${value}`}
          aria-hidden
        />
        <span className="status-dropdown__trigger-text">
          {STATUS_LABELS[value]}
        </span>
        <svg
          className={`status-dropdown__chev${open ? ' status-dropdown__chev--open' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path fill="currentColor" d="M7 10l5 5 5-5z" />
        </svg>
      </button>
      {open && (
        <ul
          id={listId}
          className="status-dropdown__menu"
          role="listbox"
          aria-label="Task status"
        >
          {OPTIONS.map((opt) => (
            <li key={opt} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={opt === value}
                className={`status-dropdown__option${opt === value ? ' status-dropdown__option--active' : ''}`}
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
              >
                <span
                  className={`status-dropdown__dot status-dropdown__dot--${opt}`}
                  aria-hidden
                />
                {STATUS_LABELS[opt]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
