import 'leaflet/dist/leaflet.css' // важнейший импорт из самой карты, без него карта работает некорректно
import './leafletFix.css' // доп файл, убирает флаг и ссылку на leaflet

import MyLocationIcon from '@mui/icons-material/MyLocation'
import L from 'leaflet'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'

const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

function LocationMarker({ onLocationSelected }) {
  const [position, setPosition] = useState(null)

  useMapEvents({
    click: async (event) => {
      const { lat, lng } = event.latlng
      setPosition({ lat, lng })
      // Обратное геокодирование для получения адреса
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        const data = await response.json()
        const address = data.display_name
        onLocationSelected({ lat, lng, address })
      } catch (error) {
        console.error('Error fetching address:', error)
        onLocationSelected({ lat, lng, address: 'Не удалось получить адрес' })
      }
    }
  })

  return position === null
    ? null
    : (
      <Marker
        position={position}
        icon={defaultIcon} />
    )
}

function SetViewOnClick({ coords }) {
  const map = useMap()
  useEffect(() => {
    map.setView(coords, map.getZoom())
  }, [coords, map])
  return null
}

function MapComponent({ onLocationSelected }) {
  const [center, setCenter] = useState([51.505, -0.09]) // Default center

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        setCenter([latitude, longitude])
      })
    }
  }, [])

  const handleCenterClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        setCenter([latitude, longitude])
      })
    }
  }

  return (
    <div className='map-container'>
      <MapContainer
        center={center}
        zoom={20}
        style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SetViewOnClick coords={center} />
        <LocationMarker onLocationSelected={onLocationSelected} />
      </MapContainer>

      <MyLocationIcon
        className='center-button'
        color='primary'
        aria-label='center map'
        onClick={handleCenterClick} />

    </div>
  )
}

export default MapComponent
