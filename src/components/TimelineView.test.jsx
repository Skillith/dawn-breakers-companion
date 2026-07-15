import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import TimelineView from './TimelineView';

describe('TimelineView Component', () => {
  const mockPeople = [
    {
      id: 'the_bab',
      name: 'The Báb (Mírzá \'Alí-Muhammad)',
      titles: ['Herald'],
      cityOfOrigin: 'Shiraz',
      bio: 'Prophet-Herald bio...',
      birthYear: 1819,
      deathYear: 1850,
      storyAppearanceYear: 1844,
      storyAppearancePage: 5,
      category: 'Manifestation'
    },
    {
      id: 'mulla_husayn',
      name: 'Mullá Husayn-i-Bushrú\'í',
      titles: ['Bábu\'l-Báb'],
      cityOfOrigin: 'Bushruyih',
      bio: 'First Letter of the Living...',
      birthYear: 1813,
      deathYear: 1849,
      storyAppearanceYear: 1844,
      storyAppearancePage: 15,
      category: 'Letter of the Living'
    },
    {
      id: 'shaykh_ahmad',
      name: 'Shaykh Ahmad-i-Ahsá\'í',
      titles: ['Founder'],
      cityOfOrigin: 'Bahrayn',
      bio: 'Precursor school...',
      birthYear: 1753,
      deathYear: 1826,
      storyAppearanceYear: 1795,
      storyAppearancePage: 1,
      category: 'Precursor'
    }
  ];

  it('renders mode toggle buttons and default story chronology', () => {
    render(<TimelineView people={mockPeople} searchQuery="" onSelectPerson={() => {}} />);
    
    // Check toggle buttons
    expect(screen.getByRole('button', { name: /Story Chronology/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Historical Chronology/i })).toBeInTheDocument();

    // In story mode, Shaykh Ahmad (Page 1) is first, then The Báb (Page 5), then Mullá Husayn (Page 15)
    const cardTitles = screen.getAllByRole('heading', { level: 3 });
    expect(cardTitles[0].textContent).toBe('Shaykh Ahmad-i-Ahsá\'í');
    expect(cardTitles[1].textContent).toBe('The Báb (Mírzá \'Alí-Muhammad)');
    expect(cardTitles[2].textContent).toBe('Mullá Husayn-i-Bushrú\'í');
  });

  it('sorts by birth year when switching to Historical Chronology', () => {
    render(<TimelineView people={mockPeople} searchQuery="" onSelectPerson={() => {}} />);
    
    // Switch to Historical Chronology
    const historicalBtn = screen.getByRole('button', { name: /Historical Chronology/i });
    fireEvent.click(historicalBtn);
    
    // Order should be: Shaykh Ahmad (1753), Mullá Husayn (1813), The Báb (1819)
    const cardTitles = screen.getAllByRole('heading', { level: 3 });
    expect(cardTitles[0].textContent).toBe('Shaykh Ahmad-i-Ahsá\'í');
    expect(cardTitles[1].textContent).toBe('Mullá Husayn-i-Bushrú\'í');
    expect(cardTitles[2].textContent).toBe('The Báb (Mírzá \'Alí-Muhammad)');
  });

  it('filters by category correctly', () => {
    render(<TimelineView people={mockPeople} searchQuery="" onSelectPerson={() => {}} />);
    
    // Click 'Letters of the Living' filter
    const filterBtn = screen.getByRole('button', { name: 'Letters of the Living' });
    fireEvent.click(filterBtn);
    
    // Only Mullá Husayn should be visible
    const cardTitles = screen.getAllByRole('heading', { level: 3 });
    expect(cardTitles.length).toBe(1);
    expect(cardTitles[0].textContent).toBe('Mullá Husayn-i-Bushrú\'í');
  });

  it('triggers onSelectPerson when clicking view profile', () => {
    const mockOnSelectPerson = vi.fn();
    render(<TimelineView people={mockPeople} searchQuery="" onSelectPerson={mockOnSelectPerson} />);
    
    // Find view profile button for The Báb card
    const babCard = screen.getByRole('heading', { name: /The Báb/i }).closest('.timeline-event-card');
    const profileBtn = within(babCard).getByRole('button', { name: /View Full Profile/i });
    
    fireEvent.click(profileBtn);
    expect(mockOnSelectPerson).toHaveBeenCalledWith('the_bab');
  });
});
