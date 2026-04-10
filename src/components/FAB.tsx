import './FAB.css'

type Props = {
  onClick: () => void
}

export function FAB({ onClick }: Props) {
  return (
    <button
      type="button"
      className="fab"
      onClick={onClick}
      aria-label="Add new task"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    </button>
  )
}
