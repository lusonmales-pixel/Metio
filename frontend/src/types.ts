export interface LatLon {
  lat: number
  lon: number
}

export interface WeatherResponse {
  weather: string
  desc: string
  temp: number
  wind_speed: number
}

export type Status = 'idle' | 'loading' | 'success' | 'error' | 'not-found'
