import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const CITY_COORDINATES = {
  maku: { x: 16, y: 20, region: "Azerbaijan (Iran)" },
  chehriq: { x: 17, y: 25, region: "Azerbaijan (Iran)" },
  tabriz: { x: 23, y: 26, region: "Azerbaijan (Iran)" },
  zanjan: { x: 32, y: 33, region: "Northwest Iran" },
  qazvin: { x: 37, y: 34, region: "North-Central Iran" },
  tehran: { x: 43, y: 38, region: "North-Central Iran" },
  barfurush: { x: 45, y: 33, region: "Mazandaran (Iran)" },
  badasht: { x: 54, y: 37, region: "Khorasan (Iran)" },
  mashhad: { x: 74, y: 35, region: "Khorasan (Iran)" },
  bushruyih: { x: 65, y: 47, region: "Khorasan (Iran)" },
  yazd: { x: 55, y: 60, region: "Central Iran" },
  isfahan: { x: 44, y: 56, region: "Central Iran" },
  shiraz: { x: 47, y: 73, region: "Fars (Iran)" },
  nayriz: { x: 53, y: 74, region: "Fars (Iran)" },
  karbila: { x: 12, y: 56, region: "Iraq" },
  najaf: { x: 12, y: 61, region: "Iraq" }
};

export default function CityMap({ cities, filteredCities, activeCityId, onSelectCity }) {
  const [hoveredCity, setHoveredCity] = useState(null);

  const handleMarkerClick = (cityId) => {
    if (onSelectCity) {
      onSelectCity(cityId);
    }
  };

  return (
    <div className="map-panel">
      <div className="map-header">
        <h3 className="map-panel-title">
          <MapPin size={18} />
          Interactive Map of Iran & Surroundings
        </h3>
        <p className="map-panel-subtitle">
          Hover over markers to view key events; click to locate details below.
        </p>
      </div>

      <div className="map-wrapper">
        <img 
          src="/modern_map.jpg" 
          alt="Modern Topographic Map of Iran and surrounding regions" 
          className="map-bg-image" 
        />
        
        {/* Grid Overlay for aesthetic structure */}
        <div className="map-grid-lines"></div>

        {/* City Markers */}
        {cities.map(city => {
          const coords = CITY_COORDINATES[city.id];
          if (!coords) return null;

          const isMatching = filteredCities.some(fc => fc.id === city.id);
          const isActive = activeCityId === city.id;

          return (
            <div
              key={city.id}
              className={`map-marker-container ${isMatching ? 'matching' : 'faded'} ${isActive ? 'active' : ''}`}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              onMouseEnter={() => setHoveredCity({ ...city, ...coords })}
              onMouseLeave={() => setHoveredCity(null)}
              onClick={() => handleMarkerClick(city.id)}
            >
              {/* Outer pulsing ring */}
              <div className="map-marker-pulse"></div>
              
              {/* Inner glowing dot */}
              <div className="map-marker-dot"></div>
              
              {/* City Name Label */}
              <span className={`map-marker-label ${coords.x > 60 ? 'label-left' : ''}`}>{city.name}</span>
            </div>
          );
        })}

        {/* Tooltip Overlay */}
        {hoveredCity && (
          <div 
            className="map-tooltip"
            style={{ 
              left: `${hoveredCity.x}%`, 
              top: `${hoveredCity.y - 3}%` 
            }}
          >
            <div className="map-tooltip-header">
              <span className="map-tooltip-name">{hoveredCity.name}</span>
              <span className="map-tooltip-region">{hoveredCity.region}</span>
            </div>
            <div className="map-tooltip-body">
              <div className="map-tooltip-meta">
                <span>{hoveredCity.events?.length || 0} Historical Event(s)</span>
                <span>•</span>
                <span>{hoveredCity.pages?.length || 0} Page Mention(s)</span>
              </div>
              {hoveredCity.events && hoveredCity.events.length > 0 && (
                <ul className="map-tooltip-events">
                  {hoveredCity.events.slice(0, 2).map((e, idx) => (
                    <li key={idx} className="map-tooltip-event-item">
                      <strong>{e.title}:</strong> {e.description.length > 60 ? `${e.description.substring(0, 60)}...` : e.description}
                    </li>
                  ))}
                  {hoveredCity.events.length > 2 && (
                    <li className="map-tooltip-more-events">
                      + {hoveredCity.events.length - 2} more event(s)...
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="map-tooltip-arrow"></div>
          </div>
        )}
      </div>

      <div className="map-footer">
        <div className="map-legend">
          <div className="legend-item">
            <span className="legend-dot active-dot"></span>
            <span>Search Match</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot faded-dot"></span>
            <span>Other City</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot selected-dot"></span>
            <span>Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
