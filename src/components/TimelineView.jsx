import React, { useState, useMemo } from 'react';
import { Clock, BookOpen, Calendar, MapPin, ExternalLink, Filter } from 'lucide-react';
import { fuzzyMatch } from '../App';

export default function TimelineView({ people, searchQuery, onSelectPerson }) {
  const [timelineMode, setTimelineMode] = useState('story'); // 'story' or 'historical'
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Figures' },
    { id: 'Manifestation', label: 'Manifestations' },
    { id: 'Letter of the Living', label: 'Letters of the Living' },
    { id: 'Prominent Believer', label: 'Believers' },
    { id: 'Opponent', label: 'Opponents' },
    { id: 'Warden', label: 'Wardens' }
  ];

  // Process, filter, and sort people for the timeline
  const timelineData = useMemo(() => {
    // 1. Apply search query
    let filtered = people;
    if (searchQuery.trim()) {
      filtered = people.filter(p => 
        fuzzyMatch(p.name, searchQuery) ||
        p.titles.some(title => fuzzyMatch(title, searchQuery)) ||
        (p.cityOfOrigin && fuzzyMatch(p.cityOfOrigin, searchQuery))
      );
    }

    // 2. Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // 3. Sort based on mode
    return [...filtered].sort((a, b) => {
      if (timelineMode === 'story') {
        // Story mode sorts by the page of first appearance in the book
        const pageA = a.storyAppearancePage || 999;
        const pageB = b.storyAppearancePage || 999;
        if (pageA !== pageB) return pageA - pageB;
        return a.name.localeCompare(b.name);
      } else {
        // Historical mode sorts by birth year.
        // Fallback: If birthYear is null, use storyAppearanceYear - 30 as a proxy
        const birthA = a.birthYear !== null ? a.birthYear : (a.storyAppearanceYear - 30);
        const birthB = b.birthYear !== null ? b.birthYear : (b.storyAppearanceYear - 30);
        if (birthA !== birthB) return birthA - birthB;
        // If birth years match, sort by death year
        const deathA = a.deathYear !== null ? a.deathYear : a.storyAppearanceYear;
        const deathB = b.deathYear !== null ? b.deathYear : b.storyAppearanceYear;
        if (deathA !== deathB) return deathA - deathB;
        return a.name.localeCompare(b.name);
      }
    });
  }, [people, searchQuery, timelineMode, selectedCategory]);

  const getCategoryColorClass = (category) => {
    switch (category) {
      case 'Manifestation': return 'category-manifestation';
      case 'Letter of the Living': return 'category-lol';
      case 'Precursor': return 'category-precursor';
      case 'Warden': return 'category-warden';
      case 'Opponent': return 'category-opponent';
      default: return 'category-believer';
    }
  };

  const formatLifespan = (person) => {
    if (person.birthYear !== null && person.deathYear !== null) {
      return `${person.birthYear} – ${person.deathYear}`;
    }
    if (person.deathYear !== null) {
      return `d. ${person.deathYear}`;
    }
    // If we only have story appearance, represent their active period
    return `Active c. ${person.storyAppearanceYear}`;
  };

  return (
    <div className="timeline-container">
      <div className="timeline-control-panel">
        <div className="timeline-mode-toggle">
          <button
            onClick={() => setTimelineMode('story')}
            className={`mode-btn ${timelineMode === 'story' ? 'active' : ''}`}
            title="Sort by their order of appearance in Nabíl's Narrative"
          >
            <BookOpen size={16} />
            Story Chronology
          </button>
          <button
            onClick={() => setTimelineMode('historical')}
            className={`mode-btn ${timelineMode === 'historical' ? 'active' : ''}`}
            title="Sort by their birth dates in real life history"
          >
            <Calendar size={16} />
            Historical Chronology
          </button>
        </div>

        <div className="timeline-category-filters">
          <span className="filter-label">
            <Filter size={14} />
            Filter:
          </span>
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`filter-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {timelineData.length > 0 ? (
        <div className="timeline-track-wrapper">
          <div className="timeline-spine"></div>
          
          <div className="timeline-events-list">
            {timelineData.map((person, index) => {
              const dateLabel = timelineMode === 'story' 
                ? `c. ${person.storyAppearanceYear} (Page ${person.storyAppearancePage})`
                : formatLifespan(person);
                
              return (
                <div key={person.id} className="timeline-event-node">
                  <div className="timeline-marker">
                    <div className="timeline-marker-dot"></div>
                  </div>
                  
                  <div className="timeline-event-card">
                    <div className="timeline-card-header">
                      <div className="timeline-card-meta">
                        <span className={`category-tag ${getCategoryColorClass(person.category)}`}>
                          {person.category}
                        </span>
                        {person.cityOfOrigin && (
                          <span className="card-origin">
                            <MapPin size={12} />
                            {person.cityOfOrigin}
                          </span>
                        )}
                      </div>
                      <h3 className="timeline-card-title">{person.name}</h3>
                      <div className="timeline-card-date">{dateLabel}</div>
                    </div>

                    <div className="timeline-card-body">
                      {person.titles && person.titles.length > 0 && (
                        <div className="timeline-card-titles">
                          Titled: {person.titles.join(", ")}
                        </div>
                      )}
                      <p className="timeline-card-bio">
                        {person.bio.length > 250 
                          ? `${person.bio.substring(0, 247)}...` 
                          : person.bio
                        }
                      </p>
                    </div>

                    <div className="timeline-card-actions">
                      <button
                        onClick={() => onSelectPerson(person.id)}
                        className="timeline-view-profile-btn"
                        title={`View full profile of ${person.name} in Figures tab`}
                      >
                        <ExternalLink size={14} />
                        View Full Profile
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="empty-state" style={{ marginTop: '1.5rem' }}>
          <Clock size={48} />
          <h3 className="empty-state-title">No Timeline Figures Found</h3>
          <p>No figures match your current search query "{searchQuery}" or category filter.</p>
        </div>
      )}
    </div>
  );
}
