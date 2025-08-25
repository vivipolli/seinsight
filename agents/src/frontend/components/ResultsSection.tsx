import React from 'react';
import { AnalysisResult } from '../types';

interface ResultsSectionProps {
  results: AnalysisResult | null;
  isVisible: boolean;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ results, isVisible }) => {
  React.useEffect(() => {
    if (isVisible && results) {
      // Scroll to results section
      setTimeout(() => {
        const element = document.getElementById('results-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' as ScrollBehavior });
        }
      }, 100);
    }
  }, [isVisible, results]);

  if (!isVisible || !results) return null;

  return (
    <div id="results-section" style={styles.resultsSection}>
      <h2 style={styles.title}>📊 Complete Market Analysis</h2>

      <div style={styles.resultCard}>
        <h3 style={styles.cardTitle}>🏷️ Generated Hashtags</h3>
        <div style={styles.hashtags}>
          {results.hashtags.map((hashtag: string, index: number) => (
            <span key={index} style={styles.hashtag}>
              {hashtag}
            </span>
          ))}
        </div>
      </div>

      <div style={styles.resultCard}>
        <h3 style={styles.cardTitle}>🧠 AI Critical Analysis</h3>
        
        <div style={styles.mockDataNotice}>
          <strong>📝 Note:</strong> We're currently using mock Twitter data about mental health and Web3 topics due to API limitations. 
          The analysis below is based on this mock data and may not directly reflect your specific business input.
        </div>
        
        <div style={styles.analysisContent}>
          <div style={styles.analysisText}>
            {results.analysis}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  resultsSection: {
    display: 'block',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '2rem',
    color: '#2d3748',
    fontWeight: 600,
  },
  resultCard: {
    background: '#f7fafc',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    borderLeft: '4px solid #667eea',
  },
  cardTitle: {
    fontSize: '1.3rem',
    marginBottom: '1rem',
    color: '#2d3748',
    fontWeight: 600,
  },
  hashtags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  hashtag: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  analysisContent: {
    background: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
  },
  analysisText: {
    whiteSpace: 'pre-wrap' as const,
    lineHeight: 1.6,
  },
  mockDataNotice: {
    background: '#e2e8f0',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    color: '#4a5568',
    borderLeft: '4px solid #667eea',
  },
};
