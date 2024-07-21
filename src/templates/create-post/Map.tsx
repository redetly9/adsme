import MyLocationIcon from '@mui/icons-material/MyLocation'
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api'
import { ControlPosition } from '@vis.gl/react-google-maps'
import { useCallback, useEffect, useState } from 'react'

import { API_KEY } from './consts'

type MapComponentProps = {
  onLocationSelected: (obj: { lat: number, lng: number, address: string }) => void
};

const containerStyle = {
  width: '100%',
  height: '100%'
}

function MapComponent({ onLocationSelected }: MapComponentProps) {
  const [center, setCenter] = useState({ lat: 51.505, lng: -0.09 })
  const [marker, setMarker] = useState<{ lat: number, lng: number } | null>(null)
  const [zoom, setZoom] = useState(17)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY
  })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        setCenter({ lat: latitude, lng: longitude })
      })
    }
  }, [])

  const handleCenterClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        setCenter({ lat: latitude, lng: longitude })
        setZoom(17)
      })
    }
  }

  const onLoad = useCallback((map: google.maps.Map) => {
    setCenter({ lat: map.getCenter()?.lat() || 51.505, lng: map.getCenter()?.lng() || -0.09 })
  }, [])

  const onClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      setMarker({ lat, lng })
      fetchAddress(lat, lng)
    }
  }

  const fetchAddress = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        if (results[0]) {
          const formattedAddress = results[0].formatted_address
          onLocationSelected({ lat, lng, address: formattedAddress })
        } else {
          console.log('No results found')
        }
      } else {
        console.log('Geocoder failed due to: ' + status)
      }
    })
  }

  return isLoaded
    ? (
      <div className='map-container'>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          onLoad={onLoad}
          onClick={onClick}
          options={{
            zoomControl: true,
            zoomControlOptions: {
              position: ControlPosition.TOP_LEFT
            },
            zoom: zoom,
            gestureHandling: 'greedy',
            disableDefaultUI: true
          }}
        >
          {marker ? <MarkerF position={marker} /> : null}
        </GoogleMap>
        <MyLocationIcon
          className='center-button'
          color='primary'
          aria-label='center map'
          onClick={handleCenterClick}
        />
      </div>
    )
    : <></>
}

export default MapComponent
