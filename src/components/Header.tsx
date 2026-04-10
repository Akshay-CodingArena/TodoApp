import './Header.css'

type Props = {
  title: string
  showBack?: boolean
  onBack?: () => void
}

export function Header({ title, showBack, onBack }: Props) {
  return (
    <header className="app-header">
      {showBack && (
        <button
          type="button"
          className="app-header__back"
          onClick={onBack}
          aria-label="Go back"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
            />
          </svg>
        </button>
      )}
      <h1 className="app-header__title">{title}</h1>
    </header>
  )
}
