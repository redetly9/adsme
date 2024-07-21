import MyLocationIcon from '@mui/icons-material/MyLocation'
import { GoogleMap, LoadScript, Marker, useJsApiLoader } from '@react-google-maps/api'
import { useCallback, useEffect, useState } from 'react'

import { API_KEY } from './consts'

type MapComponentProps = {
  onLocationSelected: (obj: { lat: number, lng: number, address: string }) => void
};

const containerStyle = {
  width: '100%',
  height: '100vh'
}

function MapComponent({ onLocationSelected }: MapComponentProps) {
  const [center, setCenter] = useState({ lat: 51.505, lng: -0.09 })
  const [marker, setMarker] = useState<{ lat: number, lng: number } | null>(null)
  const [address, setAddress] = useState<string>('')

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
          setAddress(formattedAddress)
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
      <LoadScript googleMapsApiKey={API_KEY}>
        <div className='map-container'>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onClick={onClick}
            options={{
              gestureHandling: 'greedy',
              disableDefaultUI: true
            }}
          >
            {marker ? <Marker position={marker} /> : null}
          </GoogleMap>
          <MyLocationIcon
            className='center-button'
            color='primary'
            aria-label='center map'
            onClick={handleCenterClick}
          />
          <p>
            Address:
            {address}
          </p>
        </div>
      </LoadScript>
    )
    : <></>
}

export default MapComponent
