import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Users, Map, Network, Info, Clock } from 'lucide-react';
import data from './data.json';
import PersonCard from './components/PersonCard';
import CityCard from './components/CityCard';
import RelationshipGraph from './components/RelationshipGraph';
import ExportButton from './components/ExportButton';
import TimelineView from './components/TimelineView';


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

      <section className="toolbar-section">
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
          <button
            onClick={() => { setActiveTab('timeline'); clearSearch(); }}
            className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          >
            <Clock size={16} />
            Timeline
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

        {activeTab === 'timeline' && (
          <TimelineView
            people={data.people}
            searchQuery={searchQuery}
            onSelectPerson={handleSelectPerson}
          />
        )}
      </main>

      <ExportButton people={data.people} cities={data.cities} />
    </div>
  );
}
