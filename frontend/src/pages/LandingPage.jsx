import { useState, useEffect } from 'react';
import heroImg from '../assets/hero-irrigation.jpg';

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('get_started'); // 'get_started' or 'farmer_login'
  const [contactForm, setContactForm] = useState({ name: '', email: '', role: 'farmer', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Monitor scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard accessibility for modal & drawer (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (modalOpen) setModalOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, mobileMenuOpen]);

  // Smooth scroll handler
  const handleScrollTo = (id) => {
    setMobileMenuOpen(false);
    if (id === 'home' || !id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70; // Header height offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
    setMobileMenuOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim()) return;
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', role: 'farmer', message: '' });
  };

  return (
    <div className="landing-wrapper" id="home">
      {/* ====================================================================
          A. Navigation Bar
          ==================================================================== */}
      <header className={`jal-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container jal-header-container">
          <button
            type="button"
            className="jal-brand"
            onClick={() => handleScrollTo('home')}
            aria-label="JALRAKSHAK Home — Scroll to top"
          >
            <div className="jal-brand-logo" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                <path d="M12 11a3 3 0 0 0-3 3c0 1.66 1.34 3 3 3s3-1.34 3-3" stroke="var(--jal-aqua)" strokeWidth="1.8" />
              </svg>
            </div>
            <span className="jal-brand-name">
              JAL<span className="jal-brand-accent">RAKSHAK</span>
            </span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="jal-nav-links" aria-label="Main navigation">
            <button type="button" className="jal-nav-link" onClick={() => handleScrollTo('home')}>Home</button>
            <button type="button" className="jal-nav-link" onClick={() => handleScrollTo('features')}>Features</button>
            <button type="button" className="jal-nav-link" onClick={() => handleScrollTo('how-it-works')}>How It Works</button>
            <button type="button" className="jal-nav-link" onClick={() => handleScrollTo('recommendations')}>Advisory States</button>
            <button type="button" className="jal-nav-link" onClick={() => handleScrollTo('benefits')}>Benefits</button>
            <button type="button" className="jal-nav-link" onClick={() => handleScrollTo('about')}>About</button>
            <button type="button" className="jal-nav-link" onClick={() => handleScrollTo('contact')}>Contact</button>
          </nav>

          {/* Header Action Buttons */}
          <div className="jal-header-actions">
            <button
              type="button"
              className="jal-btn jal-btn-ghost mobile-hidden"
              onClick={() => openModal('farmer_login')}
              aria-haspopup="dialog"
            >
              Farmer Login
            </button>
            <button
              type="button"
              className="jal-btn jal-btn-primary mobile-hidden"
              onClick={() => openModal('get_started')}
              aria-haspopup="dialog"
            >
              <span>Get Started</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="jal-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="jal-mobile-navigation"
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          id="jal-mobile-navigation"
          className={`jal-mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
          aria-hidden={!mobileMenuOpen}
        >
          <button type="button" className="jal-nav-link text-left" onClick={() => handleScrollTo('home')}>Home</button>
          <button type="button" className="jal-nav-link text-left" onClick={() => handleScrollTo('features')}>Features</button>
          <button type="button" className="jal-nav-link text-left" onClick={() => handleScrollTo('how-it-works')}>How It Works</button>
          <button type="button" className="jal-nav-link text-left" onClick={() => handleScrollTo('recommendations')}>Advisory States</button>
          <button type="button" className="jal-nav-link text-left" onClick={() => handleScrollTo('benefits')}>Benefits</button>
          <button type="button" className="jal-nav-link text-left" onClick={() => handleScrollTo('about')}>About</button>
          <button type="button" className="jal-nav-link text-left" onClick={() => handleScrollTo('contact')}>Contact</button>

          <div className="jal-mobile-drawer-actions">
            <button
              type="button"
              className="jal-btn jal-btn-ghost w-full"
              onClick={() => openModal('farmer_login')}
            >
              Farmer Login
            </button>
            <button
              type="button"
              className="jal-btn jal-btn-primary w-full"
              onClick={() => openModal('get_started')}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ====================================================================
            B. Hero Section
            ==================================================================== */}
        <section className="jal-hero" aria-labelledby="hero-main-title">
          <div className="jal-hero-glow-orb" aria-hidden="true" />
          <div className="container jal-hero-content">
            <div>
              <div className="jal-pill-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                <span>Smart Irrigation Decision Support</span>
              </div>

              <h1 id="hero-main-title" className="jal-hero-title">
                Smart Irrigation Decisions <br />
                <span className="jal-gradient-text">For Every Farm</span>
              </h1>

              <p className="jal-hero-desc">
                JALRAKSHAK pairs field-specific crop and soil characteristics with localized weather forecasts
                to deliver clear, explainable irrigation guidance — helping farmers optimize water usage, protect
                groundwater, and irrigate with confidence.
              </p>

              <div className="jal-hero-cta-group">
                <button
                  type="button"
                  className="jal-btn jal-btn-primary"
                  style={{ padding: '14px 28px', fontSize: '1rem' }}
                  onClick={() => openModal('get_started')}
                >
                  <span>Get Started</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="jal-btn jal-btn-ghost"
                  style={{ padding: '14px 24px', fontSize: '1rem' }}
                  onClick={() => handleScrollTo('features')}
                >
                  <span>Explore Features</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              {/* Trust & Capability Highlights */}
              <div className="jal-hero-trust-list">
                <div className="jal-trust-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Crop & Soil Stage Intelligence</span>
                </div>
                <div className="jal-trust-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                  </svg>
                  <span>72-Hour Weather & Rain Forecasts</span>
                </div>
                <div className="jal-trust-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 14 14" />
                  </svg>
                  <span>Farmer Retains Final Action</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="jal-hero-visual-card">
              <div className="jal-hero-visual-inner">
                <img
                  src={heroImg}
                  alt="Precision smart irrigation field with glowing cyan moisture sensors and healthy crops under twilight sky"
                  className="jal-hero-img"
                  width="800"
                  height="450"
                  loading="eager"
                />
                <div className="jal-hero-floating-badge">
                  <div className="jal-floating-badge-top">
                    <div className="flex items-center gap-2">
                      <span className="jal-pulse-dot" aria-hidden="true" />
                      <span className="jal-floating-badge-title">Irrigation Advisory Preview</span>
                    </div>
                    <span className="jal-floating-badge-status">WAIT (Adequate)</span>
                  </div>
                  <p className="jal-floating-badge-desc">
                    Soil moisture is sufficient for the vegetative stage and 18mm rainfall is forecast within the 36-hour decision window.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wave Divider (Hero Navy to Light Background) */}
        <div className="jal-wave-divider" aria-hidden="true">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z" fill="#F3F5F5" />
          </svg>
        </div>

        {/* ====================================================================
            C. Features Section
            ==================================================================== */}
        <section id="features" className="jal-section" aria-labelledby="features-heading">
          <div className="container">
            <div className="jal-section-header">
              <span className="jal-section-badge jal-section-badge-cyan">Core Capabilities</span>
              <h2 id="features-heading" className="jal-section-title">
                Intelligent Capabilities for Resilient Farming
              </h2>
              <p className="jal-section-subtitle">
                Engineered for Indian agricultural realities. Each module is planned to support data-backed,
                site-specific water stewardship without guesswork.
              </p>
            </div>

            <div className="jal-features-grid">
              {/* Feature 1: Weather-Aware Irrigation Guidance */}
              <div className="jal-feature-card">
                <div className="jal-feature-icon-wrapper" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" /><path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" /><path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                </div>
                <h3 className="jal-feature-title">Weather-Aware Irrigation Guidance</h3>
                <p className="jal-feature-desc">
                  Combines real-time localized weather feeds and 72-hour precipitation forecasts. If rain is expected,
                  the system advises postponing irrigation to prevent over-saturation and save water.
                </p>
                <div className="jal-feature-tag">Planned Core Module</div>
              </div>

              {/* Feature 2: Soil Moisture Monitoring */}
              <div className="jal-feature-card">
                <div className="jal-feature-icon-wrapper" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    <path d="M12 12v6" />
                    <path d="M9 15h6" />
                  </svg>
                </div>
                <h3 className="jal-feature-title">Soil Moisture Monitoring</h3>
                <p className="jal-feature-desc">
                  Designed to support direct telemetry from optional IoT soil sensors, or model soil water-retention
                  profiles derived from soil classification (alluvial, clay, black, sandy loam) and crop stage.
                </p>
                <div className="jal-feature-tag">Telemetry & Agronomic Models</div>
              </div>

              {/* Feature 3: Crop and Farm Management */}
              <div className="jal-feature-card">
                <div className="jal-feature-icon-wrapper" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
                <h3 className="jal-feature-title">Crop & Farm Management</h3>
                <p className="jal-feature-desc">
                  Configure multiple plot profiles, crop cycles, sowing dates, and irrigation methods (drip, sprinkler, furrow).
                  Guidance adapts dynamically as crops move from vegetative to flowering and maturity.
                </p>
                <div className="jal-feature-tag">Multi-Plot Support</div>
              </div>

              {/* Feature 4: Water Conservation */}
              <div className="jal-feature-card">
                <div className="jal-feature-icon-wrapper" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v5" />
                    <circle cx="12" cy="16" r="1" />
                  </svg>
                </div>
                <h3 className="jal-feature-title">Water Conservation</h3>
                <p className="jal-feature-desc">
                  Helps eliminate unnecessary pumping cycles, preserving regional aquifer reserves and cutting
                  electricity or diesel expenses. Promotes sustainable groundwater practices for long-term farm viability.
                </p>
                <div className="jal-feature-tag">Aquifer Protection</div>
              </div>

              {/* Feature 5: Data-Informed Decisions */}
              <div className="jal-feature-card jal-feature-card-span-2">
                <div className="jal-feature-icon-wrapper" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                    <circle cx="14" cy="14" r="2" />
                  </svg>
                </div>
                <h3 className="jal-feature-title">Data-Informed Irrigation Decisions</h3>
                <p className="jal-feature-desc">
                  Evaluates machine learning predictions against validated agronomic threshold rules. Every advisory
                  comes with transparent reasoning, indicators of data freshness, and uncertainty levels, ensuring farmers
                  understand why an action is suggested.
                </p>
                <div className="jal-feature-tag">Explainable Decision Engine</div>
              </div>
            </div>
          </div>
        </section>

        {/* Wave Divider (Light to Navy for How It Works) */}
        <div className="jal-wave-divider jal-wave-divider-inverted" aria-hidden="true">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z" fill="#061A2B" />
          </svg>
        </div>

        {/* ====================================================================
            D. How It Works Section
            ==================================================================== */}
        <section id="how-it-works" className="jal-section jal-section-dark" aria-labelledby="how-heading">
          <div className="container">
            <div className="jal-section-header">
              <span className="jal-section-badge jal-section-badge-dark">Workflow Blueprint</span>
              <h2 id="how-heading" className="jal-section-title">
                How JALRAKSHAK Works
              </h2>
              <p className="jal-section-subtitle">
                A structured four-step decision pipeline from farm setup to informed field action,
                keeping the farmer in total control at every stage.
              </p>
            </div>

            <div className="jal-steps-grid">
              {/* Step 1 */}
              <div className="jal-step-card">
                <div className="jal-step-number-pill" aria-hidden="true">01</div>
                <h3 className="jal-step-title">Add Farm & Crop Details</h3>
                <p className="jal-step-desc">
                  Set up your farm profile with geographical location, plot area, soil texture, crop variety,
                  sowing date, and irrigation equipment type.
                </p>
              </div>

              {/* Step 2 */}
              <div className="jal-step-card">
                <div className="jal-step-number-pill" aria-hidden="true">02</div>
                <h3 className="jal-step-title">Ingest Soil & Weather Data</h3>
                <p className="jal-step-desc">
                  The backend fetches high-resolution localized weather forecasts, estimates soil water-balance,
                  and ingests IoT moisture sensor telemetry when available.
                </p>
              </div>

              {/* Step 3 */}
              <div className="jal-step-card">
                <div className="jal-step-number-pill" aria-hidden="true">03</div>
                <h3 className="jal-step-title">Receive Clear Advisory</h3>
                <p className="jal-step-desc">
                  The decision engine combines model predictions and agronomic safety rules to produce
                  an actionable recommendation: Irrigate, Wait, or Partial Irrigation, with clear reasons.
                </p>
              </div>

              {/* Step 4 */}
              <div className="jal-step-card">
                <div className="jal-step-number-pill" aria-hidden="true">04</div>
                <h3 className="jal-step-title">Review & Record Action</h3>
                <p className="jal-step-desc">
                  Review the recommendation, make the final irrigation decision for your field, and log your
                  actual action and outcomes for ongoing monitoring.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Wave Divider (Navy to Light) */}
        <div className="jal-wave-divider" aria-hidden="true">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z" fill="#F3F5F5" />
          </svg>
        </div>

        {/* ====================================================================
            Advisory States & Agronomic Transparency Section
            ==================================================================== */}
        <section id="recommendations" className="jal-section" aria-labelledby="rec-heading">
          <div className="container">
            <div className="jal-section-header">
              <span className="jal-section-badge jal-section-badge-cyan">Decision Intelligence</span>
              <h2 id="rec-heading" className="jal-section-title">
                Transparent Advisory States
              </h2>
              <p className="jal-section-subtitle">
                Clear, unambiguous recommendations designed to eliminate confusion. If data is incomplete or stale,
                the system safely informs you rather than guessing.
              </p>
            </div>

            <div className="jal-rec-cards-grid">
              {/* IRRIGATE */}
              <div className="jal-rec-type-card state-irrigate">
                <div className="jal-rec-header">
                  <div className="jal-rec-icon-badge" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </div>
                  <span className="jal-rec-status-code">IRRIGATE</span>
                </div>
                <h3 className="jal-rec-label">Irrigate Now</h3>
                <p className="jal-rec-desc">
                  Soil moisture has dropped below the threshold for the current crop stage, no significant rain is
                  forecast, and the crop is in a water-sensitive window.
                </p>
                <div className="jal-rec-trigger">
                  <strong>Trigger:</strong> High water deficit, dry forecast window.
                </div>
              </div>

              {/* WAIT */}
              <div className="jal-rec-type-card state-wait">
                <div className="jal-rec-header">
                  <div className="jal-rec-icon-badge" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <span className="jal-rec-status-code">WAIT</span>
                </div>
                <h3 className="jal-rec-label">Wait / Hold</h3>
                <p className="jal-rec-desc">
                  Field moisture is currently adequate, or substantial rainfall is forecast within the upcoming decision
                  window, preventing premature water application.
                </p>
                <div className="jal-rec-trigger">
                  <strong>Trigger:</strong> Adequate root moisture or impending rain.
                </div>
              </div>

              {/* PARTIAL */}
              <div className="jal-rec-type-card state-partial">
                <div className="jal-rec-header">
                  <div className="jal-rec-icon-badge" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      <line x1="12" y1="9" x2="12" y2="15" />
                    </svg>
                  </div>
                  <span className="jal-rec-status-code">PARTIAL</span>
                </div>
                <h3 className="jal-rec-label">Partial Irrigation</h3>
                <p className="jal-rec-desc">
                  Moderate moisture deficit where a controlled, light application is advantageous to maintain root zone
                  health without over-saturating the field.
                </p>
                <div className="jal-rec-trigger">
                  <strong>Trigger:</strong> Light deficit or moderate shower expected.
                </div>
              </div>

              {/* INSUFFICIENT DATA */}
              <div className="jal-rec-type-card state-insufficient">
                <div className="jal-rec-header">
                  <div className="jal-rec-icon-badge" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <span className="jal-rec-status-code">FALLBACK</span>
                </div>
                <h3 className="jal-rec-label">Insufficient Data</h3>
                <p className="jal-rec-desc">
                  When weather feeds are stale (&gt;24h), crop stages undefined, or inputs out of range, the system
                  refuses to produce a fabricated advisory and alerts the farmer.
                </p>
                <div className="jal-rec-trigger">
                  <strong>Safety Rule:</strong> Never invent predictions without data.
                </div>
              </div>
            </div>

            {/* Trust and Safety Banner */}
            <div className="jal-trust-banner">
              <div className="jal-trust-banner-icon" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div className="jal-trust-banner-text">
                <h3>Decision Support, Not Automated Hardware Control</h3>
                <p>
                  JALRAKSHAK provides agronomic intelligence to empower the farmer. It does not remotely activate pumps
                  or automate valves. The farmer always retains full physical control and final judgment on the field.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            E. Benefits Section
            ==================================================================== */}
        <section id="benefits" className="jal-section" style={{ backgroundColor: '#EDF4F6' }} aria-labelledby="benefits-heading">
          <div className="container">
            <div className="jal-section-header">
              <span className="jal-section-badge jal-section-badge-cyan">Farmer Advantages</span>
              <h2 id="benefits-heading" className="jal-section-title">
                Tangible Benefits for Sustainable Agriculture
              </h2>
              <p className="jal-section-subtitle">
                Clear, grounded benefits built around farm autonomy, cost awareness, and long-term water security.
              </p>
            </div>

            <div className="jal-benefits-grid">
              {/* Benefit 1 */}
              <div className="jal-benefit-card">
                <div className="jal-benefit-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="jal-benefit-content">
                  <h3>Better-Informed Irrigation Decisions</h3>
                  <p>
                    Move away from guesswork and fixed calendar watering schedules. Receive tailored guidance that
                    accounts for crop growth stages and upcoming weather patterns.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="jal-benefit-card">
                <div className="jal-benefit-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="jal-benefit-content">
                  <h3>Improved Visibility into Farm Conditions</h3>
                  <p>
                    Gain transparent insight into your field's moisture balance, precipitation expectations, and soil
                    conditions, allowing you to plan field labor and irrigation schedules proactively.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="jal-benefit-card">
                <div className="jal-benefit-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  </svg>
                </div>
                <div className="jal-benefit-content">
                  <h3>More Responsible Water Management</h3>
                  <p>
                    By preventing excess watering before rains and avoiding shallow under-watering, JALRAKSHAK supports
                    groundwater conservation while curtailing electricity and fuel pumping costs.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="jal-benefit-card">
                <div className="jal-benefit-icon" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div className="jal-benefit-content">
                  <h3>Clearer Understanding of Available Data</h3>
                  <p>
                    Every advisory clearly states data freshness, contributing factors, and confidence level. No hidden
                    black-box scores or opaque percentages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            About Section
            ==================================================================== */}
        <section id="about" className="jal-section" aria-labelledby="about-heading">
          <div className="container">
            <div className="jal-about-grid">
              <div className="jal-about-text">
                <span className="jal-section-badge jal-section-badge-cyan">About The Initiative</span>
                <h2 id="about-heading" className="jal-section-title text-left">
                  Addressing the Agricultural Water Challenge
                </h2>
                <p>
                  JALRAKSHAK was created as part of the wider KRISHISETU platform to address one of India's most critical
                  farming bottlenecks: depleting groundwater reserves and imprecise irrigation scheduling.
                </p>
                <p>
                  Rather than imposing automated hardware controls or black-box predictions, JALRAKSHAK bridges
                  meteorological data, agronomic science, and machine learning into an accessible decision-support
                  tool that respects the farmer's experience.
                </p>

                <div className="jal-principles-list">
                  <div className="jal-principle-box">
                    <h4>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--jal-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Agronomic Rigor
                    </h4>
                    <p>Rooted in validated crop coefficients and water-balance modeling, reviewed with agricultural science.</p>
                  </div>
                  <div className="jal-principle-box">
                    <h4>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--jal-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Safe Fallbacks
                    </h4>
                    <p>Returns explicit data warnings instead of guessing when weather or sensor feeds are stale or unavailable.</p>
                  </div>
                </div>
              </div>

              {/* Technical Blueprint Overview Card */}
              <div className="jal-about-architecture-card">
                <div className="jal-arch-header">
                  <div className="jal-brand-logo" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </div>
                  <h3 className="jal-arch-title">Technical Stack & Integrity</h3>
                </div>

                <div className="jal-arch-stack">
                  <div className="jal-arch-row">
                    <span className="jal-arch-label">Frontend</span>
                    <span className="jal-arch-val">React.js + Vite + CSS</span>
                  </div>
                  <div className="jal-arch-row">
                    <span className="jal-arch-label">Core Backend</span>
                    <span className="jal-arch-val">Java + Spring Boot + REST</span>
                  </div>
                  <div className="jal-arch-row">
                    <span className="jal-arch-label">Persistence</span>
                    <span className="jal-arch-val">MongoDB + Spring Data</span>
                  </div>
                  <div className="jal-arch-row">
                    <span className="jal-arch-label">ML Service</span>
                    <span className="jal-arch-val">Python + FastAPI + Scikit-Learn</span>
                  </div>
                  <div className="jal-arch-row">
                    <span className="jal-arch-label">Security</span>
                    <span className="jal-arch-val">Spring Security + JWT</span>
                  </div>
                  <div className="jal-arch-row">
                    <span className="jal-arch-label">Development Phase</span>
                    <span className="jal-arch-val" style={{ color: '#FCD34D' }}>Phase 1 (Home Page Preview)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            Contact Section
            ==================================================================== */}
        <section id="contact" className="jal-section" style={{ backgroundColor: '#F8FAFB' }} aria-labelledby="contact-heading">
          <div className="container">
            <div className="jal-section-header">
              <span className="jal-section-badge jal-section-badge-cyan">Community & Inquiries</span>
              <h2 id="contact-heading" className="jal-section-title">
                Connect with the JALRAKSHAK Team
              </h2>
              <p className="jal-section-subtitle">
                We welcome inquiries from farming collectives, agronomists, research institutions, and developers
                interested in pilot validation and technical collaboration.
              </p>
            </div>

            <div className="jal-contact-grid">
              {/* Project Information & Verified Resources */}
              <div className="jal-contact-info-card">
                <h3>Project Information & Collaboration</h3>
                <p>
                  JALRAKSHAK is currently undergoing structured engineering phases. For technical reviews,
                  research proposals, or questions regarding our open roadmap, connect directly through our official repository.
                </p>

                <a
                  href="https://github.com/janmejayy-gif/CU-PROJECT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jal-contact-link-row"
                  aria-label="Visit JALRAKSHAK GitHub Repository (opens in new tab)"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  <div className="flex-1">
                    <div>GitHub Repository</div>
                    <span className="text-xs text-muted font-normal">github.com/janmejayy-gif/CU-PROJECT</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>

                <div className="mt-6 p-4 rounded-lg bg-pale-aqua border border-border-light text-xs text-secondary leading-relaxed">
                  <strong>Pilot Advisory Note:</strong> Field trials and farmer onboarding are part of Phase 2.
                  All experimental results will be documented transparently on GitHub.
                </div>
              </div>

              {/* Inquiry & Feedback Form */}
              <div className="jal-contact-form-card">
                <h3>Submit an Inquiry or Feedback</h3>
                <p>Interested in future pilot programs or sharing agronomic feedback? Send us a note.</p>

                {contactSubmitted ? (
                  <div className="jal-success-alert" role="status">
                    <div className="font-bold mb-1">Thank you for your interest!</div>
                    <div>Your inquiry has been received. Our project team will reach out once pilot onboarding begins.</div>
                    <button
                      type="button"
                      className="jal-btn jal-btn-outline-dark btn-sm mt-3"
                      onClick={() => setContactSubmitted(false)}
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <div className="jal-form-field">
                      <label htmlFor="contact-name" className="jal-form-label">Full Name *</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        className="jal-input-ctrl"
                        placeholder="e.g. Ramesh Patel"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      />
                    </div>

                    <div className="jal-form-field">
                      <label htmlFor="contact-email" className="jal-form-label">Email or Phone *</label>
                      <input
                        id="contact-email"
                        type="text"
                        required
                        className="jal-input-ctrl"
                        placeholder="e.g. ramesh@example.com or mobile number"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>

                    <div className="jal-form-field">
                      <label htmlFor="contact-role" className="jal-form-label">Your Role / Affiliation</label>
                      <select
                        id="contact-role"
                        className="jal-input-ctrl form-select"
                        value={contactForm.role}
                        onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                      >
                        <option value="farmer">Farmer / Grower</option>
                        <option value="agronomist">Agronomist / Extension Officer</option>
                        <option value="researcher">Agricultural Researcher / Academic</option>
                        <option value="developer">Developer / Contributor</option>
                        <option value="other">Other Community Member</option>
                      </select>
                    </div>

                    <div className="jal-form-field">
                      <label htmlFor="contact-message" className="jal-form-label">Inquiry or Feedback</label>
                      <textarea
                        id="contact-message"
                        rows="3"
                        className="jal-input-ctrl"
                        placeholder="Share your region, crop interests, or questions..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      />
                    </div>

                    <button
                      type="submit"
                      className="jal-btn jal-btn-primary w-full"
                    >
                      Submit Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            F. Final CTA Section
            ==================================================================== */}
        <section className="jal-closing-cta" aria-labelledby="cta-heading">
          <div className="container jal-closing-cta-box">
            <span className="jal-pill-badge mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <span>Sustainable Irrigation Stewardship</span>
            </span>

            <h2 id="cta-heading" className="jal-closing-cta-title">
              Ready to Practice Smarter Water Management?
            </h2>

            <p className="jal-closing-cta-desc">
              Discover how data-backed irrigation intelligence protects crops and conserves critical groundwater.
              Farmer onboarding and farm profile setup will be enabled in Phase 2.
            </p>

            <button
              type="button"
              className="jal-btn jal-btn-primary"
              style={{ padding: '16px 36px', fontSize: '1.05rem' }}
              onClick={() => openModal('get_started')}
            >
              <span>Explore Preview & Roadmap</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      {/* ====================================================================
          G. Footer
          ==================================================================== */}
      <footer className="jal-footer" role="contentinfo">
        <div className="container">
          <div className="jal-footer-top">
            <div className="jal-footer-brand-col">
              <button
                type="button"
                className="jal-brand"
                onClick={() => handleScrollTo('home')}
                aria-label="JALRAKSHAK Home — Scroll to top"
              >
                <div className="jal-brand-logo" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </div>
                <span className="jal-brand-name">
                  JAL<span className="jal-brand-accent">RAKSHAK</span>
                </span>
              </button>
              <p>
                AI-assisted Smart Irrigation Decision Support System for farmers.
                Part of the KRISHISETU platform dedicated to sustainable agricultural technology.
              </p>
            </div>

            <div className="jal-footer-col">
              <h4>Navigation</h4>
              <ul className="jal-footer-links">
                <li><button type="button" className="jal-footer-link" onClick={() => handleScrollTo('home')}>Home</button></li>
                <li><button type="button" className="jal-footer-link" onClick={() => handleScrollTo('features')}>Features</button></li>
                <li><button type="button" className="jal-footer-link" onClick={() => handleScrollTo('how-it-works')}>How It Works</button></li>
                <li><button type="button" className="jal-footer-link" onClick={() => handleScrollTo('recommendations')}>Advisory States</button></li>
                <li><button type="button" className="jal-footer-link" onClick={() => handleScrollTo('benefits')}>Benefits</button></li>
              </ul>
            </div>

            <div className="jal-footer-col">
              <h4>Information</h4>
              <ul className="jal-footer-links">
                <li><button type="button" className="jal-footer-link" onClick={() => handleScrollTo('about')}>About JALRAKSHAK</button></li>
                <li><button type="button" className="jal-footer-link" onClick={() => handleScrollTo('contact')}>Contact & Inquiries</button></li>
                <li>
                  <a
                    href="https://github.com/janmejayy-gif/CU-PROJECT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="jal-footer-link"
                  >
                    GitHub Repository ↗
                  </a>
                </li>
              </ul>
            </div>

            <div className="jal-footer-col">
              <h4>Development Status</h4>
              <p style={{ fontSize: '0.85rem', color: '#8CAAB9', lineHeight: '1.5', margin: 0 }}>
                Phase 1 (Landing Page) completed. Phase 2 (Authentication & Farm Profile Setup) is the next approved milestone.
              </p>
              <div className="mt-3">
                <button
                  type="button"
                  className="jal-btn jal-btn-ghost btn-sm"
                  onClick={() => openModal('get_started')}
                >
                  View Phase 1 Notice
                </button>
              </div>
            </div>
          </div>

          <div className="jal-footer-bottom">
            <div className="jal-footer-disclaimer">
              © 2026 JALRAKSHAK. Part of the KRISHISETU project. Built for farmers. Final irrigation decisions always remain with the farmer.
            </div>

            <button
              type="button"
              className="jal-back-to-top"
              onClick={() => handleScrollTo('home')}
              aria-label="Back to top of page"
            >
              <span>Back to Top</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          Informational Modal (Phase 1 Preview Notice for Login / Get Started)
          ==================================================================== */}
      {modalOpen && (
        <div
          className="jal-modal-overlay"
          onClick={closeModal}
          role="presentation"
        >
          <div
            className="jal-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="jal-modal-heading"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="jal-modal-close"
              onClick={closeModal}
              aria-label="Close dialog"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="jal-modal-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Phase 1 — Public Preview</span>
            </div>

            <h3 id="jal-modal-heading" className="jal-modal-title">
              {modalType === 'farmer_login' ? 'Farmer Login Coming in Phase 2' : 'Farmer Onboarding Coming in Phase 2'}
            </h3>

            <p className="jal-modal-body">
              {modalType === 'farmer_login'
                ? 'Farmer account authentication, profile management, and dashboard sessions are scheduled for implementation in Phase 2 according to our project roadmap.'
                : 'Registration, farm plot onboarding, and crop profile creation are scheduled for implementation in Phase 2 according to our project roadmap.'}
            </p>

            <div className="jal-modal-roadmap-note">
              <strong>Current Milestone:</strong> Phase 1 focuses exclusively on the public Home Page and architecture preview. You can explore all planned capabilities, agronomic workflows, and advisory states directly on this page.
            </div>

            <div className="jal-modal-actions">
              <button
                type="button"
                className="jal-btn jal-btn-ghost btn-sm"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="button"
                className="jal-btn jal-btn-primary btn-sm"
                onClick={() => {
                  closeModal();
                  handleScrollTo('features');
                }}
              >
                Explore Features
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;