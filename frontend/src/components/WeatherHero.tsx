import type { LatLon, Status, WeatherResponse } from '../types'
import MetaRow from './MetaRow'

interface WeatherHeroProps {
  status: Status
  city: string
  weather: WeatherResponse | null
  latLon: LatLon | null
}

const ERROR_MESSAGE = 'Сервис сейчас недоступен. Проверьте подключение и попробуйте снова.'
const NOT_FOUND_MESSAGE = 'Город не найден. Проверьте написание и попробуйте снова.'

export default function WeatherHero({ status, city, weather, latLon }: WeatherHeroProps) {
  if (status === 'success' && weather !== null && latLon !== null) {
    return (
      <main className="hero">
        <div className="hero-content" key={city}>
          <h1 className="hero-city">{city}</h1>
          <p className="hero-condition">{weather.weather}</p>
          <div className="hero-temp">
            <span className="hero-temp-value">{Math.round(weather.temp - 273.15)}</span>
            <span className="hero-temp-unit">°C</span>
          </div>
          <p className="hero-desc">{weather.desc}</p>
          <MetaRow windSpeed={weather.wind_speed} latLon={latLon} />
        </div>
      </main>
    )
  }

  return (
    <main className="hero">
      {status === 'loading' ? (
        <div className="hero-content">
          <p className="hero-condition hero-condition--muted">Загрузка…</p>
          <div className="hero-temp hero-temp--loading">
            <div className="skeleton" aria-hidden="true" />
          </div>
        </div>
      ) : null}

      {status === 'error' ? (
        <div className="hero-content">
          <p className="hero-status hero-status--error">{ERROR_MESSAGE}</p>
        </div>
      ) : null}

      {status === 'not-found' ? (
        <div className="hero-content">
          <p className="hero-status">{NOT_FOUND_MESSAGE}</p>
        </div>
      ) : null}

      {status === 'idle' ? (
        <div className="hero-content">
          <h1 className="hero-city hero-city--idle">Город</h1>
          <p className="hero-condition hero-condition--muted">Введите название города</p>
          <div className="hero-temp hero-temp--idle">
            <span className="hero-temp-value">—</span>
            <span className="hero-temp-unit">°C</span>
          </div>
        </div>
      ) : null}
    </main>
  )
}
