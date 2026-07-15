import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Users, Map, Network, Info } from 'lucide-react';
import data from './data.json';
import PersonCard from './components/PersonCard';
import CityCard from './components/CityCard';
import RelationshipGraph from './components/RelationshipGraph';
import ExportButton from './components/ExportButton';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [activeTab, setActiveTab] = useState('people');
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedItemId, setFocusedItemId] = useState(null);

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
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      person.name.toLowerCase().includes(query) ||
      person.bio.toLowerCase().includes(query) ||
      (person.cityOfOrigin && person.cityOfOrigin.toLowerCase().includes(query)) ||
      person.titles.some(title => title.toLowerCase().includes(query))
    );
  }).sort((a, b) => a.name.localeCompare(b.name));

  // Filter cities
  const filteredCities = data.cities.filter(city => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      city.name.toLowerCase().includes(query) ||
      city.events.some(e => e.title.toLowerCase().includes(query) || e.description.toLowerCase().includes(query))
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

      <section className="toolbar-section">
        <div className="search-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder={activeTab === 'people' ? "Search historical figures, titles, bios, origins..." : "Search cities and historical events..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="tabs-container">
          <button
            onClick={() => { setActiveTab('people'); clearSearch(); }}
            className={`tab-btn ${activeTab === 'people' ? 'active' : ''}`}
          >
            <Users size={16} />
            Figures ({filteredPeople.length})
          </button>
          <button
            onClick={() => { setActiveTab('cities'); clearSearch(); }}
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
        </div>
      </section>

      <main style={{ flexGrow: 1, marginBottom: '2rem' }}>
        {activeTab === 'people' && (
          filteredPeople.length > 0 ? (
            <div className="results-grid">
              {filteredPeople.map(person => (
                <PersonCard
                  key={person.id}
                  person={person}
                  allPeople={data.people}
                  onSelectPerson={handleSelectPerson}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Users size={48} />
              <h3 className="empty-state-title">No Figures Found</h3>
              <p>No historical figures match your search query "{searchQuery}".</p>
            </div>
          )
        )}

        {activeTab === 'cities' && (
          filteredCities.length > 0 ? (
            <div className="results-grid">
              {filteredCities.map(city => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Map size={48} />
              <h3 className="empty-state-title">No Cities Found</h3>
              <p>No cities or events match your search query "{searchQuery}".</p>
            </div>
          )
        )}

        {activeTab === 'relations' && (
          <RelationshipGraph
            people={data.people}
            onSelectPerson={handleSelectPerson}
          />
        )}
      </main>

      <ExportButton people={data.people} cities={data.cities} />
    </div>
  );
}
