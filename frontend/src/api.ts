import type { LatLon, WeatherResponse } from './types'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  // The Go backend may answer 200 with an empty body on internal errors,
  // so response.json() alone is not reliable here.
  const text = await response.text()

  if (text.length === 0) {
    throw new Error('Empty response body')
  }

  return JSON.parse(text) as T
}

export function getLatLon(city: string): Promise<LatLon> {
  return postJson<LatLon>('/getLanLon', { city })
}

export function getWeather(lat: number, lon: number): Promise<WeatherResponse> {
  return postJson<WeatherResponse>('/getWeather', { lat, lon })
}
