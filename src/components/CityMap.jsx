import React, { useState } from 'react';
import { MapPin, X, Navigation } from 'lucide-react';
import { TRAVEL_DATA } from '../travelData';

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

export default function CityMap({ cities, filteredCities, activeCityId, onSelectCity, activeTravelPersonId, onClearTravelPath, hoveredStepIndex, setHoveredStepIndex }) {
  const [hoveredCity, setHoveredCity] = useState(null);

  const handleMarkerClick = (cityId) => {
    if (onSelectCity) {
      onSelectCity(cityId);
    }
  };

  const travel = activeTravelPersonId ? TRAVEL_DATA[activeTravelPersonId] : null;
  const pathPoints = travel
    ? travel.path
        .map((step, idx) => ({ ...step, idx, coords: CITY_COORDINATES[step.cityId] }))
        .filter(step => step.coords)
    : [];

  const pathD = pathPoints.length > 1
    ? pathPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.coords.x} ${point.coords.y}`).join(' ')
    : '';

  const activeHoveredStepCityId = hoveredStepIndex !== null && pathPoints[hoveredStepIndex]
    ? pathPoints[hoveredStepIndex].cityId
    : null;

  const tooltipCity = hoveredCity || (activeHoveredStepCityId
    ? {
        ...cities.find(c => c.id === activeHoveredStepCityId),
        ...CITY_COORDINATES[activeHoveredStepCityId],
        name: cities.find(c => c.id === activeHoveredStepCityId)?.name || activeHoveredStepCityId
      }
    : null);

  let transformStyle = 'translate(-50%, -108%)';
  let arrowLeftStyle = '50%';
  if (tooltipCity && tooltipCity.x !== undefined) {
    if (tooltipCity.x < 25) {
      transformStyle = 'translate(-10%, -108%)';
      arrowLeftStyle = '15%';
    } else if (tooltipCity.x > 75) {
      transformStyle = 'translate(-90%, -108%)';
      arrowLeftStyle = '85%';
    }
  }

  return (
    <div className="map-panel">
      <div className="map-header">
        <div className="map-title-row">
          <h3 className="map-panel-title">
            <MapPin size={18} />
            Interactive Map of Iran & Surroundings
          </h3>
          {travel && (
            <button onClick={onClearTravelPath} className="clear-travel-top-btn" title="Clear travel path">
              <X size={14} /> Clear Path
            </button>
          )}
        </div>
        <p className="map-panel-subtitle">
          {travel 
            ? `Now tracing the journey of ${travel.name.split(" (")[0]}. Hover over steps to highlight.`
            : "Hover over markers to view key events; click to locate details below."}
        </p>
      </div>

      <div className="map-wrapper">
        <img 
          src="modern_map.jpg" 
          alt="Modern Topographic Map of Iran and surrounding regions" 
          className="map-bg-image" 
        />
        
        {/* Grid Overlay for aesthetic structure */}
        <div className="map-grid-lines"></div>

        {/* SVG Travel Path Overlay */}
        {pathPoints.length > 1 && (
          <svg 
            className="map-travel-svg" 
            viewBox="0 0 100 100" 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'none', 
              zIndex: 5 
            }}
          >
            {/* Glow Path */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="2.5"
              strokeOpacity="0.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: 'blur(3px)' }}
            />
            {/* Animated dashed line overlay */}
            <path
              className="map-travel-animated-path"
              d={pathD}
              fill="none"
              stroke="var(--accent-color)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4, 4"
            />
          </svg>
        )}

        {/* City Markers */}
        {cities.map(city => {
          const coords = CITY_COORDINATES[city.id];
          if (!coords) return null;

          const isMatching = filteredCities.some(fc => fc.id === city.id);
          const isActive = activeCityId === city.id;
          
          // Check if this city is part of the current travel path
          const travelStep = pathPoints.find(step => step.cityId === city.id);
          const isHighlightedStep = hoveredStepIndex !== null && pathPoints[hoveredStepIndex]?.cityId === city.id;

          return (
            <div
              key={city.id}
              className={`map-marker-container ${isMatching ? 'matching' : 'faded'} ${isActive ? 'active' : ''} ${travelStep ? 'in-travel-path' : ''} ${isHighlightedStep ? 'highlighted-step' : ''}`}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              onMouseEnter={() => setHoveredCity({ ...city, ...coords })}
              onMouseLeave={() => setHoveredCity(null)}
              onClick={() => handleMarkerClick(city.id)}
            >
              {/* Outer pulsing ring */}
              <div className="map-marker-pulse"></div>
              
              {/* Inner glowing dot */}
              <div className="map-marker-dot"></div>

              {/* Step number badge */}
              {travelStep && (
                <div className="map-marker-step-badge">
                  {travelStep.idx + 1}
                </div>
              )}
              
              {/* City Name Label */}
              <span className={`map-marker-label ${coords.x > 60 ? 'label-left' : ''}`}>{city.name}</span>
            </div>
          );
        })}

        {/* Tooltip Overlay */}
        {tooltipCity && (
          <div 
            className="map-tooltip"
            style={{ 
              left: `${tooltipCity.x}%`, 
              top: `${tooltipCity.y - 3}%`,
              transform: transformStyle
            }}
          >
            <div className="map-tooltip-header">
              <span className="map-tooltip-name">{tooltipCity.name}</span>
              <span className="map-tooltip-region">{tooltipCity.region}</span>
            </div>
            <div className="map-tooltip-body">
              <div className="map-tooltip-meta">
                <span>{tooltipCity.events?.length || 0} Historical Event(s)</span>
                <span>•</span>
                <span>{tooltipCity.pages?.length || 0} Page Mention(s)</span>
              </div>
              {tooltipCity.events && tooltipCity.events.length > 0 && (
                <ul className="map-tooltip-events">
                  {tooltipCity.events.slice(0, 2).map((e, idx) => (
                    <li key={idx} className="map-tooltip-event-item">
                      <strong>{e.title}:</strong> {e.description.length > 60 ? `${e.description.substring(0, 60)}...` : e.description}
                    </li>
                  ))}
                  {tooltipCity.events.length > 2 && (
                    <li className="map-tooltip-more-events">
                      + {tooltipCity.events.length - 2} more event(s)...
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="map-tooltip-arrow" style={{ left: arrowLeftStyle }}></div>
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
          {travel && (
            <div className="legend-item">
              <span className="legend-dot travel-dot"></span>
              <span>Journey Step</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
