import React from 'react';
import { User, MapPin, BookOpen, AlertTriangle } from 'lucide-react';

export default function PersonCard({ person, allPeople, onSelectPerson }) {
  const getRelationDisplayName = (targetId) => {
    const target = allPeople.find(p => p.id === targetId);
    return target ? target.name.split(" (")[0] : targetId;
  };

  return (
    <div className="card-item" id={`person-${person.id}`}>
      <div className="card-header">
        <div className="card-meta-row">
          <span className={`category-tag ${
            person.category === 'Location of Relevance' ? 'location-relevance' :
            person.category === 'Text of Relevance' ? 'text-relevance' :
            person.category === 'Term of Relevance' ? 'term-relevance' :
            'people'
          }`}>
            {person.category === 'Location of Relevance' || 
             person.category === 'Text of Relevance' || 
             person.category === 'Term of Relevance' 
              ? person.category 
              : 'Historical Figure'}
          </span>
          {person.cityOfOrigin && (
            <span className="card-origin">
              <MapPin size={14} />
              {person.cityOfOrigin}
            </span>
          )}
        </div>
        <h3 className="card-title">{person.name}</h3>
        {person.titles && person.titles.length > 0 && (
          <div className="card-subtitle">
            Titled: {person.titles.join(", ")}
          </div>
        )}
      </div>

      <div className="card-body">
        {person.bio.split("\n\n").map((para, idx) => (
          <p key={idx} className="bio-paragraph">{para}</p>
        ))}

        {person.confusionAlert && allPeople && allPeople.some(p => p.id !== person.id && p.name === person.name) && (
          <div className="confusion-alert">
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span><strong>Avoid Confusion:</strong> {person.confusionAlert}</span>
          </div>
        )}

        {person.relations && person.relations.length > 0 && (
          <div className="relations-section">
            <h4 className="section-label">Connections</h4>
            <div className="relations-list">
              {person.relations.map((relation, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPerson(relation.targetId)}
                  className="relation-pill"
                  title={`View profile of ${getRelationDisplayName(relation.targetId)}`}
                  style={{ cursor: 'pointer', background: 'transparent' }}
                >
                  <span className="relation-type">{relation.type}</span>
                  <span className="relation-target">{getRelationDisplayName(relation.targetId)}</span>
                </button>
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
          {person.pages && person.pages.length > 0 ? (
            person.pages.map((p, idx) => (
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
