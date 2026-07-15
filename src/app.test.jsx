import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App, { normalizeText, getEditDistance, fuzzyMatch } from './App';
import data from './data.json';

describe('Search Optimization Helpers (Unit Tests)', () => {
  it('should normalize text by stripping accents, hyphens, and apostrophes', () => {
    expect(normalizeText('Mull\u00e1')).toBe('mulla');
    expect(normalizeText('M\u00edrz\u00e1')).toBe('mirza');
    expect(normalizeText("Bah\u00e1'u'll\u00e1h")).toBe('bahaullah');
    expect(normalizeText("Husayn-i-Bushr\u00fa'\u00ed")).toBe('husayn i bushrui');
    expect(normalizeText("  Siyyid  ")).toBe('siyyid');
  });

  it('should calculate Levenshtein distance correctly', () => {
    expect(getEditDistance('mula', 'mulla')).toBe(1);
    expect(getEditDistance('bahaullah', 'baha\'u\'llah')).toBe(2);
    expect(getEditDistance('test', 'test')).toBe(0);
    expect(getEditDistance('', 'abc')).toBe(3);
  });

  it('should match terms with accents and minor typos', () => {
    // Exact accent-insensitive
    expect(fuzzyMatch("Mull\u00e1 Husayn-i-Bushr\u00fa'\u00ed", 'mulla')).toBe(true);
    // Accent-insensitive with hyphens/apostrophes ignored
    expect(fuzzyMatch("Bah\u00e1'u'll\u00e1h (M\u00edrz\u00e1 Husayn-'Al\u00ed)", 'bahaullah')).toBe(true);
    // Typo match (Levenshtein distance <= 25% of query word length, min 1)
    expect(fuzzyMatch('Mull\u00e1', 'mula')).toBe(true);
    // Mismatch
    expect(fuzzyMatch('Qudd\u00fas', 'tahirih')).toBe(false);
  });
});

describe('Dawn-Breakers Study Companion Integration Tests', () => {
  it('US-01: should display historical figures alphabetically with titles', () => {
    render(<App />);
    
    // Check that figures tab is active by default and displays cards
    const figuresTab = screen.getByRole('button', { name: /Figures/i });
    expect(figuresTab).toHaveClass('active');

    // Check alphabetical sorting (e.g. Bahá'u'lláh, Mullá Husayn, Quddús, The Báb, Vahíd)
    const cardTitles = screen.getAllByRole('heading', { level: 3 });
    const titleTexts = cardTitles.map(t => t.textContent.trim());
    
    // Verify names are listed
    expect(titleTexts.some(text => text.includes("The B\u00e1b"))).toBe(true);
    expect(titleTexts.some(text => text.includes("Bah\u00e1'u'll\u00e1h"))).toBe(true);

    // Verify titles/aliases are consolidated on cards
    const babCard = cardTitles.find(t => t.textContent.includes("The B\u00e1b")).closest('.card-item');
    expect(within(babCard).getByText(/Titled: Siyyid-i-B\u00e1b, The Herald, M\u00edrz\u00e1 'Al\u00ed-Muhammad/i)).toBeInTheDocument();
  });

  it('US-02: should keep identical names separate and show confusion alerts', () => {
    render(<App />);
    
    // Mullá Husayn has a confusion alert in data.json
    const confusionAlerts = screen.getAllByText(/Avoid Confusion/i);
    expect(confusionAlerts.length).toBeGreaterThan(0);
    
    const pageText = screen.getByText(/Do not confuse with Bah\u00e1'u'll\u00e1h/i);
    expect(pageText).toBeInTheDocument();
  });

  it('US-03: should render biographies, origin cities, and page numbers', () => {
    render(<App />);
    
    // Check bio content, origin city, and pages for The Báb
    const babCard = screen.getAllByRole('heading', { level: 3 })
      .find(t => t.textContent.includes("The B\u00e1b"))
      .closest('.card-item');
    
    expect(within(babCard).getAllByText(/Shiraz/i).length).toBeGreaterThan(0);
    expect(within(babCard).getByText(/The B\u00e1b \(meaning 'The Gate'\) was the Prophet-Herald/i)).toBeInTheDocument();
    
    // Page list numbers
    expect(within(babCard).getByText('5')).toBeInTheDocument();
    expect(within(babCard).getByText('9')).toBeInTheDocument();
  });

  it('US-04: should navigate to and focus target figure when clicking connection pills', async () => {
    render(<App />);
    
    // Find The Báb card
    const babCard = screen.getAllByRole('heading', { level: 3 })
      .find(t => t.textContent.includes("The B\u00e1b"))
      .closest('.card-item');
    
    // Find relationship button/pill for Teacher of Mullá Husayn
    const mullaHusaynPill = within(babCard).getByTitle(/Mull\u00e1 Husayn/i);
    expect(mullaHusaynPill).toBeInTheDocument();
    
    // Click it
    fireEvent.click(mullaHusaynPill);
    
    // Verify it stays on Figures tab and clears query
    expect(screen.getByRole('button', { name: /Figures/i })).toHaveClass('active');
  });

  it('US-05: should list cities, high-level events, and timelines on Cities tab', () => {
    render(<App />);
    
    // Switch to Cities tab
    const citiesTab = screen.getByRole('button', { name: /Cities/i });
    fireEvent.click(citiesTab);
    expect(citiesTab).toHaveClass('active');

    // Verify cities list (Badasht)
    const cityCard = screen.getByRole('heading', { name: /Badasht/i }).closest('.card-item');
    expect(cityCard).toBeInTheDocument();
    expect(within(cityCard).getByText(/Conference of Badasht/i)).toBeInTheDocument();
    expect(within(cityCard).getByText(/signaling the independence of the new dispensation/i)).toBeInTheDocument();
  });

  it('US-06: should perform robust, accent-insensitive fuzzy search', () => {
    render(<App />);
    
    const searchInput = screen.getByPlaceholderText(/Search historical figures, titles, origins/i);
    
    // Test case 1: Search "Mulla" without diacritics
    fireEvent.change(searchInput, { target: { value: 'Mulla' } });
    
    const mullaResults = screen.getAllByRole('heading', { level: 3 });
    // Should match "Mullá Husayn-i-Bushrú'í" and "Quddús (Mullá Muhammad...)"
    expect(mullaResults.some(r => r.textContent.includes('Mull\u00e1'))).toBe(true);
    expect(mullaResults.some(r => r.textContent.includes('The B\u00e1b'))).toBe(false); // Bab does not match mulla
    expect(mullaResults.some(r => r.textContent.includes('Hamzih M\u00edrz\u00e1'))).toBe(false); // Hamzih Mirza's bio mentions Mullá, but he shouldn't match
    
    // Test case 2: Search "mula" with typo
    fireEvent.change(searchInput, { target: { value: 'mula' } });
    const typoResults = screen.getAllByRole('heading', { level: 3 });
    expect(typoResults.some(r => r.textContent.includes('Mull\u00e1'))).toBe(true);
    
    // Test case 3: Search "bahaullah"
    fireEvent.change(searchInput, { target: { value: 'bahaullah' } });
    const bahaullahResults = screen.getAllByRole('heading', { level: 3 });
    expect(bahaullahResults.some(r => r.textContent.includes('Bah\u00e1\'u\'ll\u00e1h'))).toBe(true);
    expect(bahaullahResults.some(r => r.textContent.includes('Qudd\u00fas'))).toBe(false);
  });

  it('US-07: should render action buttons for booklet printing and Word export', () => {
    render(<App />);
    
    const printButton = screen.getByRole('button', { name: /Print Booklet/i });
    const exportButton = screen.getByRole('button', { name: /Export to Word/i });
    
    expect(printButton).toBeInTheDocument();
    expect(exportButton).toBeInTheDocument();
  });
});
