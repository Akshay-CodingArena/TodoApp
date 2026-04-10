import { useMemo, useState } from 'react'
import { FAB } from './components/FAB'
import { Header } from './components/Header'
import { SearchBar } from './components/SearchBar'
import { TaskAccordion } from './components/TaskAccordion'
import { TaskForm } from './components/TaskForm'
import { usePersistentTasks } from './hooks/usePersistentTasks'
import type { TaskInput } from './hooks/usePersistentTasks'
import type { Task } from './types/task'
import './App.css'

type View = 'list' | 'add' | 'edit'

export default function App() {
  const { tasks, addTask, updateTask, deleteTask } = usePersistentTasks()
  const [view, setView] = useState<View>('list')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return tasks
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    )
  }, [tasks, search])

  const editingTask = useMemo(
    () => (editingId ? tasks.find((t) => t.id === editingId) : undefined),
    [tasks, editingId],
  )

  function openEdit(task: Task) {
    setEditingId(task.id)
    setView('edit')
  }

  function handleAdd(input: TaskInput) {
    const ok = addTask(input)
    if (ok) setView('list')
    return ok
  }

  function handleEditSubmit(input: TaskInput) {
    if (!editingId) return false
    const ok = updateTask(editingId, input)
    if (ok) {
      setEditingId(null)
      setView('list')
    }
    return ok
  }

  function cancelForm() {
    setEditingId(null)
    setView('list')
  }

  return (
    <div className="app-shell">
      {view === 'list' && (
        <>
          <Header title="TO-DO APP" />
          <div className="app-shell__scroll">
            <SearchBar value={search} onChange={setSearch} />
            <TaskAccordion
              tasks={filteredTasks}
              onEdit={openEdit}
              onDelete={deleteTask}
            />
          </div>
          <FAB onClick={() => setView('add')} />
        </>
      )}

      {view === 'add' && (
        <>
          <Header
            title="Add Task"
            showBack
            onBack={cancelForm}
          />
          <div className="app-shell__scroll">
            <TaskForm mode="add" onSubmit={handleAdd} onCancel={cancelForm} />
          </div>
        </>
      )}

      {view === 'edit' && editingTask && (
        <>
          <Header
            title="Edit Task"
            showBack
            onBack={cancelForm}
          />
          <div className="app-shell__scroll">
            <TaskForm
              key={editingTask.id}
              mode="edit"
              task={editingTask}
              onSubmit={handleEditSubmit}
              onCancel={cancelForm}
            />
          </div>
        </>
      )}
    </div>
  )
}
