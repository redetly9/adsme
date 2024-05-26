// MapComponent.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import IconButton from '@mui/material/IconButton';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function LocationMarker({ onLocationSelected }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click: async (event) => {
      const { lat, lng } = event.latlng;
      setPosition({ lat, lng });
      // Обратное геокодирование для получения адреса
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        const address = data.display_name;
        onLocationSelected({ lat, lng, address });
      } catch (error) {
        console.error('Error fetching address:', error);
        onLocationSelected({ lat, lng, address: 'Не удалось получить адрес' });
      }
    }
  });
  

  return position === null ? null : (
    <Marker position={position} icon={defaultIcon} />
  );
}

function SetViewOnClick({ coords }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

function MapComponent({ onLocationSelected }) {
  const [center, setCenter] = useState([51.505, -0.09]); // Default center

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
      });
    }
  }, []);

  const handleCenterClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
      });
    }
  };

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={20} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SetViewOnClick coords={center} />
        <LocationMarker onLocationSelected={onLocationSelected} />
      </MapContainer>

      <MyLocationIcon className="center-button"
        color="primary"
        aria-label="center map"
        onClick={handleCenterClick} />

    </div>
  );
}

export default MapComponent;
