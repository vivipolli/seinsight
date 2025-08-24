import React from 'react';

export const Header: React.FC = () => {
  return (
    <div style={styles.header}>
      <div style={styles.logoContainer}>
        <img src="/logo.png" alt="Seinsight AI Logo" style={styles.logo} />
      </div>
      <h1 style={styles.title}>Seinsight AI</h1>
      <p style={styles.subtitle}>
        Gain insights from real community conversations<br />
        to better understand how your needs and interests<br />
        are reflected in the Web3 space.
      </p>
    </div>
  );
};

const styles = {
  header: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  logo: {
    width: '48px',
    height: '48px',
    objectFit: 'contain' as const,
    //filter: 'brightness(0) invert(1)',
    opacity: 0.7,
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#ff5e5d',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 400,
    letterSpacing: '0.01em',
  },
};
