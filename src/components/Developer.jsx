/**
 * Component: Developer
 * Description: Renders a full-screen, premium dark-themed developer profile page 
 *              detailing Nikhil Gupta's background, portfolio, and app vision.
 */

import React from 'react';
import { ArrowLeft, Code, Globe, Heart, ShieldCheck, GraduationCap, Sparkles } from 'lucide-react';

export default function Developer({ onBack }) {
  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1.25rem 2rem 1.25rem',
      boxSizing: 'border-box',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflowX: 'hidden'
    }}>
      
      {/* ==========================================
          Top Navigation Bar (Back Button)
          ========================================== */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '420px', marginInline: 'auto', marginBottom: '1.5rem' }}>
        <button 
          onClick={onBack}
          style={{
            backgroundColor: '#121212',
            border: '1px solid #262626',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#ffffff',
            transition: 'background-color 0.2s'
          }}
          title="Back to Dashboard"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', margin: 0, color: '#9ca3af', letterSpacing: '0.05em' }}>Developer Profile</h2>
        <div style={{ width: '40px' }}></div> {/* Balance spacing */}
      </div>

      {/* ==========================================
          Main Content Container (Scrollable & Responsive)
          ========================================== */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        marginInline: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        flexGrow: 1
      }}>
        
        {/* Developer Avatar / Logo Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(37, 99, 235, 0.15)',
          color: '#3b82f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          border: '1px solid rgba(37, 99, 235, 0.4)',
          boxShadow: '0 0 30px rgba(37, 99, 235, 0.2)'
        }}>
          <Code size={36} />
        </div>

        {/* Name & Title */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 0.25rem 0' }}>Nikhil Gupta</h1>
        <p style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: '600', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
          <GraduationCap size={16} /> BCA Student & Software Developer
        </p>

        {/* Bio Card */}
        <div style={{
          backgroundColor: '#0a0a0a',
          border: '1px solid #1f2937',
          borderRadius: '1.25rem',
          padding: '1.25rem',
          textAlign: 'left',
          width: '100%',
          marginBottom: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          <h3 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: '700', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#3b82f6" /> About Me
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: '1.5', margin: 0 }}>
            Hello! I am Nikhil Gupta, a first-year BCA student at IGNOU and a passionate web developer. I love crafting high-performance, mobile-first applications with clean code and modern aesthetics, aspiring to build impactful software at Google.
          </p>
        </div>

        {/* App Trust & Vision Card */}
        <div style={{
          backgroundColor: '#0a0a0a',
          border: '1px solid #1f2937',
          borderRadius: '1.25rem',
          padding: '1.25rem',
          textAlign: 'left',
          width: '100%',
          marginBottom: '1.5rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          <h3 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: '700', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} color="#10b981" /> Why Trust Money Tracker?
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: '1.5', margin: 0 }}>
            We built this app with a deep commitment to your financial privacy and ease of use. Thank you for placing your trust in us as you take control of your daily spending habits. Your data security and smooth experience are our top priorities.
          </p>
        </div>

        {/* Portfolio Link Button */}
        <a 
          href="https://nikhildev161011-tech.github.io/Nikhil-s-Portfolio/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            width: '100%',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontWeight: '700',
            padding: '0.95rem 1rem',
            borderRadius: '1rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            fontSize: '0.95rem',
            boxShadow: '0 4px 15px rgba(255,255,255,0.15)',
            transition: 'opacity 0.2s'
          }}
        >
          <Globe size={18} /> Explore Developer Portfolio
        </a>

      </div>

      {/* ==========================================
          Footer Note
          ========================================== */}
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6b7280', marginTop: '1.5rem' }}>
        Made with <Heart size={12} color="#f87171" style={{ display: 'inline', margin: '0 2px' }} /> by Nikhil Gupta
      </div>

    </div>
  );
}