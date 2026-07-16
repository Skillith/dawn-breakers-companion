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

export default function CityMap({ cities, filteredCities, activeCityId, onSelectCity, activeTravelPersonId, onClearTravelPath }) {
  const [hoveredCity, setHoveredCity] = useState(null);
  const [hoveredStepIndex, setHoveredStepIndex] = useState(null);

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
            ? `Now tracing the journey of ${travel.name}. Hover over steps below to highlight.`
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

      {/* Travel Journey Panel */}
      {travel && (
        <div className="map-travel-panel">
          <div className="map-travel-panel-header">
            <h4 className="map-travel-panel-title">
              <Navigation size={16} />
              Chronological Journey of {travel.name}
            </h4>
          </div>
          <div className="map-travel-steps">
            {travel.path.map((step, idx) => {
              const cityData = cities.find(c => c.id === step.cityId);
              return (
                <div
                  key={idx}
                  className={`map-travel-step ${hoveredStepIndex === idx ? 'hovered' : ''}`}
                  onMouseEnter={() => {
                    setHoveredStepIndex(idx);
                    if (cityData) {
                      setHoveredCity({
                        ...cityData,
                        ...CITY_COORDINATES[step.cityId]
                      });
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredStepIndex(null);
                    setHoveredCity(null);
                  }}
                  onClick={() => handleMarkerClick(step.cityId)}
                >
                  <span className="step-num">{idx + 1}</span>
                  <div className="step-content">
                    <div className="step-meta">
                      <strong className="step-city">{cityData?.name || step.cityId}</strong>
                      <span className="step-date">{step.date}</span>
                    </div>
                    <p className="step-description">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
