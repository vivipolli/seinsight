import React from 'react';

interface LoadingSectionProps {
  isVisible: boolean;
}

export const LoadingSection: React.FC<LoadingSectionProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div style={styles.loading}>
      <div style={styles.spinner}></div>
      <p>Analisando mercado e gerando insights...</p>
      <p style={styles.subText}>Isso pode levar alguns segundos</p>
    </div>
  );
};

const styles = {
  loading: {
    textAlign: 'center' as const,
    padding: '2rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  subText: {
    fontSize: '0.9rem',
    color: '#718096',
    marginTop: '0.5rem',
  },
};
