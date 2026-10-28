import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('JALRAKSHAK Farmer Application UI', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders JALRAKSHAK brand, phenology calendar, and root-zone moisture rail', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /JALRAKSHAK/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /ICAR Crop Phenology Calendar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Field Irrigation Advisory/i })
    ).toBeInTheDocument();
  });

  it('navigates across all 9 core farmer routes', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', {
      name: /Farmer Application Routes/i,
    });

    fireEvent.click(screen.getAllByRole('button', { name: /My Farms/i })[0]);
    expect(
      screen.getByRole('heading', { name: /My Farms & Active Crop Cycles/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Irrigation/i })[0]);
    expect(
      screen.getByRole('heading', { name: /ML Irrigation Need Predictor/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Recommendations/i })[0]);
    expect(
      screen.getByRole('heading', {
        name: /Irrigation Recommendations & Input Snapshots/i,
      })
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Weather/i })[0]);
    expect(
      screen.getByRole('heading', {
        name: /Weather Observations & 6-Hour Freshness Guard/i,
      })
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Analytics/i })[0]);
    expect(
      screen.getByRole('heading', {
        name: /Seasonal Water-Balance & Evapotranspiration Ledger/i,
      })
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /History/i })[0]);
    expect(
      screen.getByRole('heading', {
        name: /Farmer Execution History & Outcome Feedback/i,
      })
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Alerts/i })[0]);
    expect(
      screen.getByRole('heading', {
        name: /Field Alerts, Stale-Data Guards & Irrigation Windows/i,
      })
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Settings/i })[0]);
    expect(
      screen.getByRole('heading', {
        name: /Farmer Preferences & Regional Settings/i,
      })
    ).toBeInTheDocument();

    expect(nav).toBeInTheDocument();
  });

  it('opens top-right Login and Register dialogs and toggles theme', () => {
    render(<App />);

    const loginBtn = screen.getByRole('button', { name: /Login \/ लॉगिन/i });
    fireEvent.click(loginBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Farmer Login/i })
    ).toBeInTheDocument();

    const switchRegBtn = screen.getByRole('button', {
      name: /Switch to Register/i,
    });
    fireEvent.click(switchRegBtn);
    expect(
      screen.getByRole('heading', { name: /Register Farmer/i })
    ).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', {
      name: /Close authentication dialog/i,
    });
    fireEvent.click(closeBtn);

    const themeBtn = screen.getByRole('button', {
      name: /Toggle daylight or night theme/i,
    });
    fireEvent.click(themeBtn);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
