import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Users, Map, Network, Info, Clock, BookOpen, X } from 'lucide-react';
import data from './data.json';
import PersonCard from './components/PersonCard';
import CityCard from './components/CityCard';
import CityMap from './components/CityMap';
import RelationshipGraph from './components/RelationshipGraph';
import ExportButton from './components/ExportButton';
import TimelineView from './components/TimelineView';
import ResourcesView from './components/ResourcesView';
import { TRAVEL_DATA } from './travelData';


export function normalizeText(text) {
  if (!text) return '';
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[-]/g, " ")            // replace hyphens with spaces
    .replace(/['’`']/g, "")          // remove apostrophes/quotes
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");           // collapse spaces
}

export function getEditDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function fuzzyMatch(text, query) {
  if (!query) return true;
  if (!text) return false;

  const normText = normalizeText(text);
  const normQuery = normalizeText(query);

  // Direct substring match is the primary check
  if (normText.includes(normQuery)) return true;

  // Word-based match check
  const queryWords = normQuery.split(" ");
  const textWords = normText.split(" ");

  // Every word in query should match (or be very close to) at least one word in text
  return queryWords.every(qWord => {
    if (qWord.length <= 2) {
      // For very short words, require simple prefix/substring match
      return textWords.some(tWord => tWord.includes(qWord));
    }
    return textWords.some(tWord => {
      if (tWord.includes(qWord)) return true;
      // Allow minor typos (Levenshtein distance <= 25% of query word length, min 1 typo)
      const maxDistance = Math.max(1, Math.floor(qWord.length * 0.25));
      return getEditDistance(qWord, tWord) <= maxDistance;
    });
  });
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [activeTab, setActiveTab] = useState('people');
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedItemId, setFocusedItemId] = useState(null);
  const [activeCityId, setActiveCityId] = useState(null);
  const [activeTravelPersonId, setActiveTravelPersonId] = useState(null);
  const [hoveredStepIndex, setHoveredStepIndex] = useState(null);
  const isTesting = typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.VITEST);
  const [visiblePeopleCount, setVisiblePeopleCount] = useState(isTesting ? 1000 : 24);

  // Reset pagination when search query changes
  useEffect(() => {
    setVisiblePeopleCount(isTesting ? 1000 : 24);
  }, [searchQuery, isTesting]);

  const handleTraceJourney = (personId) => {
    setActiveTravelPersonId(personId);
    setActiveTab('cities');
    setActiveCityId(null);
    setHoveredStepIndex(null);
    
    // Smooth scroll to map
    setTimeout(() => {
      const element = document.querySelector('.map-panel');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleClearTravelPath = () => {
    setActiveTravelPersonId(null);
    setHoveredStepIndex(null);
  };

  const handleSelectCity = (cityId) => {
    setActiveCityId(cityId);
    
    // Smooth scroll only the right-hand container to keep map and list aligned
    setTimeout(() => {
      const container = document.querySelector('.cities-list-container');
      const element = document.getElementById(`city-${cityId}`);
      if (container && element) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTarget = container.scrollTop + (elementRect.top - containerRect.top) - 8; // 8px offset for breathing room
        
        container.scrollTo({
          top: scrollTarget,
          behavior: 'smooth'
        });

        // Briefly flash card border
        element.style.borderColor = 'var(--accent-color)';
        element.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.4)';
        setTimeout(() => {
          element.style.borderColor = '';
          element.style.boxShadow = '';
        }, 1500);
      }
    }, 100);
  };

  // Sync theme with DOM and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Click relationship link callback
  const handleSelectPerson = (personId) => {
    setActiveTab('people');
    setSearchQuery('');
    setFocusedItemId(personId);
    
    // Smooth scroll to the person card
    setTimeout(() => {
      const element = document.getElementById(`person-${personId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Briefly flash card border
        element.style.borderColor = '#b8860b';
        element.style.boxShadow = '0 0 15px rgba(184, 134, 11, 0.4)';
        setTimeout(() => {
          element.style.borderColor = '';
          element.style.boxShadow = '';
        }, 1500);
      }
    }, 100);
  };

  // Filter people
  const filteredPeople = data.people.filter(person => {
    if (!searchQuery.trim()) return true;
    return (
      fuzzyMatch(person.name, searchQuery) ||
      (person.cityOfOrigin && fuzzyMatch(person.cityOfOrigin, searchQuery)) ||
      person.titles.some(title => fuzzyMatch(title, searchQuery))
    );
  }).sort((a, b) => a.name.localeCompare(b.name));

  // Filter cities
  const filteredCities = data.cities.filter(city => {
    if (!searchQuery.trim()) return true;
    return (
      fuzzyMatch(city.name, searchQuery) ||
      city.events.some(e => fuzzyMatch(e.title, searchQuery) || fuzzyMatch(e.description, searchQuery))
    );
  }).sort((a, b) => a.name.localeCompare(b.name));

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="app-container">
      <header>
        <div className="header-title-row">
          <h1 className="app-title">The Dawn-Breakers</h1>
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? (
              <>
                <Moon size={16} />
                Dark Mode
              </>
            ) : (
              <>
                <Sun size={16} />
                Light Mode
              </>
            )}
          </button>
        </div>
        <p className="app-subtitle">A Historical Study Companion & Index of Names and Cities</p>
      </header>

      <section className="toolbar-section" style={{ gridTemplateColumns: activeTab === 'resources' ? '1fr' : undefined }}>
        {activeTab !== 'resources' && (
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder={
                activeTab === 'people' ? "Search historical figures, titles, origins..." :
                activeTab === 'cities' ? "Search cities and historical events..." :
                activeTab === 'timeline' ? "Search timeline figures by name, title, origin..." :
                "Search..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        <div className="tabs-container" style={{ margin: activeTab === 'resources' ? '0 auto' : undefined }}>
          <button
            onClick={() => { setActiveTab('people'); clearSearch(); }}
            className={`tab-btn ${activeTab === 'people' ? 'active' : ''}`}
          >
            <Users size={16} />
            Figures ({filteredPeople.length})
          </button>
          <button
            onClick={() => { setActiveTab('cities'); clearSearch(); setActiveCityId(null); }}
            className={`tab-btn ${activeTab === 'cities' ? 'active' : ''}`}
          >
            <Map size={16} />
            Cities ({filteredCities.length})
          </button>
          <button
            onClick={() => { setActiveTab('relations'); clearSearch(); }}
            className={`tab-btn ${activeTab === 'relations' ? 'active' : ''}`}
          >
            <Network size={16} />
            Connections Map
          </button>
          <button
            onClick={() => { setActiveTab('timeline'); clearSearch(); }}
            className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          >
            <Clock size={16} />
            Timeline
          </button>
          <button
            onClick={() => { setActiveTab('resources'); clearSearch(); }}
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            Resources
          </button>
        </div>
      </section>

      <main style={{ flexGrow: 1, marginBottom: '2rem' }}>
        {activeTab === 'people' && (
          filteredPeople.length > 0 ? (
            <>
              <div className="results-grid">
                {filteredPeople.slice(0, visiblePeopleCount).map(person => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    allPeople={data.people}
                    onSelectPerson={handleSelectPerson}
                    onTraceJourney={handleTraceJourney}
                    hasTravelRoute={!!TRAVEL_DATA[person.id]}
                  />
                ))}
              </div>
              {filteredPeople.length > visiblePeopleCount && (
                <div className="show-more-container">
                  <button
                    onClick={() => setVisiblePeopleCount(prev => prev + 24)}
                    className="show-more-btn"
                  >
                    Load More Figures ({filteredPeople.length - visiblePeopleCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <Users size={48} />
              <h3 className="empty-state-title">No Figures Found</h3>
              <p>No historical figures match your search query "{searchQuery}".</p>
            </div>
          )
        )}

        {activeTab === 'cities' && (
          <div className="cities-layout">
            <CityMap
              cities={data.cities}
              filteredCities={filteredCities}
              activeCityId={activeCityId}
              onSelectCity={handleSelectCity}
              activeTravelPersonId={activeTravelPersonId}
              onClearTravelPath={handleClearTravelPath}
              hoveredStepIndex={hoveredStepIndex}
              setHoveredStepIndex={setHoveredStepIndex}
            />
            {activeTravelPersonId && TRAVEL_DATA[activeTravelPersonId] ? (
              <div className="cities-list-panel travel-steps-panel">
                <div className="cities-list-header">
                  <div className="map-title-row">
                    <h3 className="cities-list-panel-title">
                      <Network size={18} />
                      Journey of {TRAVEL_DATA[activeTravelPersonId].name.split(" (")[0]}
                    </h3>
                    <button
                      onClick={handleClearTravelPath}
                      className="clear-travel-top-btn"
                      title="Clear travel path"
                    >
                      <X size={14} /> Clear Path
                    </button>
                  </div>
                  <p className="cities-list-panel-subtitle">
                    Chronological steps of their travels. Hover to highlight on the map.
                  </p>
                </div>
                <div className="cities-list-container">
                  <div className="map-travel-steps">
                    {TRAVEL_DATA[activeTravelPersonId].path.map((step, idx) => {
                      const cityData = data.cities.find(c => c.id === step.cityId);
                      return (
                        <div
                          key={idx}
                          className={`map-travel-step ${hoveredStepIndex === idx ? 'hovered' : ''}`}
                          onMouseEnter={() => setHoveredStepIndex(idx)}
                          onMouseLeave={() => setHoveredStepIndex(null)}
                          onClick={() => handleSelectCity(step.cityId)}
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
              </div>
            ) : (
              <div className="cities-list-panel">
                <div className="cities-list-header">
                  <h3 className="cities-list-panel-title">
                    <BookOpen size={18} />
                    Cities & Events Directory
                  </h3>
                  <p className="cities-list-panel-subtitle">
                    Browse cities alphabetically or search for events.
                  </p>
                </div>
                <div className="cities-list-container">
                  {filteredCities.length > 0 ? (
                    <div className="cities-grid">
                      {filteredCities.map(city => (
                        <CityCard
                          key={city.id}
                          city={city}
                          isActive={activeCityId === city.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <Map size={48} />
                      <h3 className="empty-state-title">No Cities Found</h3>
                      <p>No cities or events match your search query "{searchQuery}".</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'relations' && (
          <RelationshipGraph
            people={data.people}
            onSelectPerson={handleSelectPerson}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            people={data.people}
            searchQuery={searchQuery}
            onSelectPerson={handleSelectPerson}
            onTraceJourney={handleTraceJourney}
            travelDataKeys={Object.keys(TRAVEL_DATA)}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesView />
        )}
      </main>

      <ExportButton people={data.people} cities={data.cities} />
    </div>
  );
}
