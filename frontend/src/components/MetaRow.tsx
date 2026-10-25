import type { LatLon } from '../types'

interface MetaRowProps {
  windSpeed: number
  latLon: LatLon
}

export default function MetaRow({ windSpeed, latLon }: MetaRowProps) {
  const latLabel = `${Math.abs(latLon.lat).toFixed(2)}°${latLon.lat >= 0 ? 'N' : 'S'}`
  const lonLabel = `${Math.abs(latLon.lon).toFixed(2)}°${latLon.lon >= 0 ? 'E' : 'W'}`

  return (
    <div className="hero-meta">
      <div className="hero-meta-item">
        <span className="hero-meta-label">Wind</span>
        <span className="hero-meta-value">{windSpeed.toFixed(1)} m/s</span>
      </div>
      <div className="hero-meta-item">
        <span className="hero-meta-label">Coords</span>
        <span className="hero-meta-value">
          {latLabel} · {lonLabel}
        </span>
      </div>
    </div>
  )
}
