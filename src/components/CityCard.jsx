import React from 'react';
import { Map, BookOpen } from 'lucide-react';

export default function CityCard({ city, isActive }) {
  return (
    <div className={`card-item ${isActive ? 'active' : ''}`} id={`city-${city.id}`}>
      <div className="card-header">
        <div className="card-meta-row">
          <span className="category-tag cities">Location</span>
        </div>
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Map size={18} className="text-secondary" />
          {city.name}
        </h3>
      </div>

      <div className="card-body">
        {city.events && city.events.length > 0 && (
          <div className="events-section" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
            <h4 className="section-label">High-Level Events</h4>
            <div className="events-list">
              {city.events.map((event, idx) => (
                <div key={idx} className="event-item">
                  <div className="event-title">{event.title}</div>
                  <div className="event-desc">{event.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card-pages">
        <span className="pages-label">
          <BookOpen size={14} />
          Page Mentions
        </span>
        <div className="page-list-container">
          {city.pages && city.pages.length > 0 ? (
            city.pages.map((p, idx) => (
              <span key={idx} className="page-badge" title={`Approximately Page ${p}`}>
                {p}
              </span>
            ))
          ) : (
            <span className="page-badge">No direct text mention</span>
          )}
        </div>
      </div>
    </div>
  );
}
