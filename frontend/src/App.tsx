import { useCallback, useState } from 'react'
import SearchBar from './components/SearchBar'
import WeatherHero from './components/WeatherHero'
import Wordmark from './components/Wordmark'
import { getLatLon, getWeather } from './api'
import type { LatLon, Status, WeatherResponse } from './types'

export default function App() {
  const [status, setStatus] = useState<Status>('idle')
  const [city, setCity] = useState('')
  const [latLon, setLatLon] = useState<LatLon | null>(null)
  const [weather, setWeather] = useState<WeatherResponse | null>(null)

  const handleSearch = useCallback(async (name: string) => {
    setStatus('loading')

    try {
      const nextLatLon = await getLatLon(name)

      // The backend answers {lat:0, lon:0} with 200 when the city was not
      // found, so this is the only reliable "not found" signal we get.
      if (nextLatLon.lat === 0 && nextLatLon.lon === 0) {
        setStatus('not-found')
        return
      }

      const nextWeather = await getWeather(nextLatLon.lat, nextLatLon.lon)

      setCity(name)
      setLatLon(nextLatLon)
      setWeather(nextWeather)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }, [])

  return (
    <div className="app">
      <Wordmark />
      <WeatherHero status={status} city={city} weather={weather} latLon={latLon} />
      <SearchBar status={status} onSearch={handleSearch} />
    </div>
  )
}
