import { type FormEvent, useState } from 'react'
import type { Task, TaskStatus } from '../types/task'
import type { TaskInput } from '../hooks/usePersistentTasks'
import { StatusDropdown } from './StatusDropdown'
import './TaskForm.css'

type Props =
  | {
      mode: 'add'
      onSubmit: (input: TaskInput) => boolean
      onCancel: () => void
    }
  | {
      mode: 'edit'
      task: Task
      onSubmit: (input: TaskInput) => boolean
      onCancel: () => void
    }

export function TaskForm(props: Props) {
  const initial =
    props.mode === 'edit'
      ? {
          title: props.task.title,
          description: props.task.description,
          status: props.task.status,
        }
      : { title: '', description: '', status: 'pending' as TaskStatus }

  const [title, setTitle] = useState(initial.title)
  const [description, setDescription] = useState(initial.description)
  const [status, setStatus] = useState<TaskStatus>(initial.status)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (props.mode === 'add') {
      props.onSubmit({ title, description, status: 'pending' })
    } else {
      props.onSubmit({ title, description, status })
    }
  }

  const submitLabel = props.mode === 'add' ? 'ADD' : 'Update'
  const titleError = title.trim().length === 0

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__field">
        <label className="visually-hidden" htmlFor="task-title">
          Title
        </label>
        <input
          id="task-title"
          className="task-form__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter the title."
          maxLength={200}
          aria-invalid={titleError}
        />
      </div>

      <div className="task-form__field">
        <label className="visually-hidden" htmlFor="task-desc">
          Description
        </label>
        <textarea
          id="task-desc"
          className="task-form__textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter the description."
          rows={5}
          maxLength={2000}
        />
      </div>

      {props.mode === 'edit' && (
        <StatusDropdown value={status} onChange={setStatus} />
      )}

      <div className="task-form__actions">
        <button
          type="button"
          className="task-form__btn task-form__btn--secondary"
          onClick={props.onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="task-form__btn task-form__btn--primary"
          disabled={titleError}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
