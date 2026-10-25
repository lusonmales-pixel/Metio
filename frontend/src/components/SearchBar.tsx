import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Status } from '../types'

interface SearchBarProps {
  status: Status
  onSearch: (city: string) => void
}

export default function SearchBar({ status, onSearch }: SearchBarProps) {
  const [value, setValue] = useState('')
  const isLoading = status === 'loading'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const city = value.trim()

    if (city.length === 0) {
      return
    }

    onSearch(city)
  }

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <div className="search-form">
        <input
          className="search-input"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Введите город"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Название города"
        />
        <button
          className="search-button"
          type="submit"
          disabled={isLoading}
          aria-label="Найти погоду"
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.8-3.8" />
          </svg>
        </button>
      </div>
    </form>
  )
}
