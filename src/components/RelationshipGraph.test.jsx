import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RelationshipGraph from './RelationshipGraph';

describe('RelationshipGraph Component', () => {
  const mockPeople = [
    {
      id: 'the_bab',
      name: 'The Báb (Mírzá \'Alí-Muhammad)',
      relations: [
        { targetId: 'bahaullah', type: 'Prophesied' }
      ]
    },
    {
      id: 'bahaullah',
      name: 'Bahá\'u\'lláh',
      relations: []
    }
  ];

  let originalGetContext;

  beforeEach(() => {
    // Mock Math.random to make initial positions deterministic
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    // Mock HTMLCanvasElement.prototype.getContext directly to avoid recursion
    originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = () => {
      return {
        clearRect: () => {},
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
        stroke: () => {},
        fillText: () => {},
        save: () => {},
        restore: () => {},
        translate: () => {},
        scale: () => {},
        moveTo: () => {},
        lineTo: () => {},
        createRadialGradient: () => {
          return {
            addColorStop: () => {},
          };
        },
      };
    };
  });

  afterEach(() => {
    vi.spyOn(Math, 'random').mockRestore();
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it('renders the canvas and controls', () => {
    const { container } = render(
      <RelationshipGraph people={mockPeople} onSelectPerson={() => {}} />
    );

    // Verify title and label
    expect(screen.getByText('Interactive Connections Map')).toBeInTheDocument();

    // Verify canvas exists
    const canvas = container.querySelector('.graph-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('width', '900');
    expect(canvas).toHaveAttribute('height', '500');

    // Verify control buttons exist
    expect(screen.getByTitle('Zoom In')).toBeInTheDocument();
    expect(screen.getByTitle('Zoom Out')).toBeInTheDocument();
    expect(screen.getByTitle('Recenter / Jitter')).toBeInTheDocument();
  });

  it('triggers onSelectPerson when clicking a node', () => {
    const mockOnSelectPerson = vi.fn();
    const { container } = render(
      <RelationshipGraph people={mockPeople} onSelectPerson={mockOnSelectPerson} />
    );

    const canvas = container.querySelector('.graph-canvas');
    expect(canvas).toBeInTheDocument();

    // Simulate clicking Node 0 ('the_bab')
    // Calculated position with Math.random returning 0.5 and scale = 0.6:
    // angle = 0, radius = 210, x = 660, y = 250
    // clientX = 180 + 660 * 0.6 = 576, clientY = 100 + 250 * 0.6 = 250
    fireEvent.mouseDown(canvas, { clientX: 576, clientY: 250 });
    fireEvent.mouseUp(canvas);

    expect(mockOnSelectPerson).toHaveBeenCalledWith('the_bab');
  });

  it('zooms in and zooms out correctly', () => {
    const { container } = render(
      <RelationshipGraph people={mockPeople} onSelectPerson={() => {}} />
    );

    const zoomInBtn = screen.getByTitle('Zoom In');
    const zoomOutBtn = screen.getByTitle('Zoom Out');

    // Click zoom buttons and verify no crashes occur
    fireEvent.click(zoomInBtn);
    fireEvent.click(zoomOutBtn);
  });

  it('recenters and jitters correctly', () => {
    const { container } = render(
      <RelationshipGraph people={mockPeople} onSelectPerson={() => {}} />
    );

    const recenterBtn = screen.getByTitle('Recenter / Jitter');
    fireEvent.click(recenterBtn);
  });
});
