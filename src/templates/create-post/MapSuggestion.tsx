// AutocompleteInput.js
import React, { useState } from 'react'

const AutocompleteInput = ({ onSelectAddress, value, setValue }) => {
  const [suggestions, setSuggestions] = useState([])

  const handleInput = async (e) => {
    const query = e.target.value
    setValue(query)

    if (query.length > 2) {
      const response = await fetch(`https://photon.komoot.io/api/?q=${query}&limit=5`)
      const results = await response.json()
      setSuggestions(results.features)
    } else {
      setSuggestions([])
    }
  }

  const handleSelect = (suggestion) => {
    const { name, city, country } = suggestion.properties
    const lat = suggestion.properties.extent?.[1]
    const lon = suggestion.properties.extent?.[0]
    const displayName = `${name}, ${city}, ${country}`
    setValue(displayName)
    setSuggestions([])
    onSelectAddress({ address: displayName, lat: parseFloat(lat), lng: parseFloat(lon) })
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        value={value}
        onChange={handleInput}
        placeholder='Введите адрес'
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '2px solid #ccc' }}
      />
      {suggestions.length > 0 && (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0, position: 'absolute', width: '100%', backgroundColor: 'white', border: '1px solid #ccc', zIndex: 1000 }}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.properties.osm_id}
              onClick={() => handleSelect(suggestion)}
              style={{ padding: '8px', cursor: 'pointer' }}
            >
              {`${suggestion.properties.name}, ${suggestion.properties.city}, ${suggestion.properties.country}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AutocompleteInput
