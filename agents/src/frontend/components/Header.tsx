import React from 'react';

export const Header: React.FC = () => {
  return (
    <div style={styles.header}>
      <h1 style={styles.title}>Seinsight AI</h1>
      <p style={styles.subtitle}>Intelligent market analysis for Web3 entrepreneurs</p>
    </div>
  );
};

const styles = {
  header: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
    color: 'white',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 700,
    marginBottom: '1rem',
    background: 'linear-gradient(45deg, #fff, #f0f0f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.2rem',
    opacity: 0.9,
    fontWeight: 300,
  },
};
