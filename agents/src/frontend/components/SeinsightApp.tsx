import React, { useState } from 'react';
import { Header } from './Header';
import { InputSection } from './InputSection';
import { LoadingSection } from './LoadingSection';
import { ResultsSection } from './ResultsSection';
import { VerificationSection } from './VerificationSection';
import { ProcessingProgress } from './ProcessingProgress';
import { SeinsightServiceWithProgressFixed } from '../services/SeinsightService';
import { useProcessingProgress } from '../hooks/useProcessingProgress';
import { AnalysisResult } from '../types';

export const SeinsightApp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isVisible, currentStep, startProcessing, setStep, completeProcessing, resetProcessing } = useProcessingProgress();

  const seinsightService = new SeinsightServiceWithProgressFixed();

  const handleAnalysisSubmit = async (businessDescription: string) => {
    if (!businessDescription.trim()) return;

    setIsLoading(true);
    setResults(null);
    setError(null);
    startProcessing();

    try {
      const analysisResult = await seinsightService.performRealAnalysis(
        businessDescription,
        (step) => setStep(step)
      );
      setResults(analysisResult);
      setTimeout(() => {
        completeProcessing();
      }, 1000);
    } catch (err) {
      setError('Error performing analysis. Please try again.');
      console.error('Analysis error:', err);
      resetProcessing();
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div style={styles.container}>
      <Header />  
      
      <div style={styles.mainContent}>
        <InputSection 
          onSubmit={handleAnalysisSubmit}
          isLoading={isLoading}
          error={error}
          onClearError={clearError}
        />
        
        {isVisible ? (
          <ProcessingProgress 
            isVisible={isVisible}
            currentStep={currentStep}
            onComplete={() => {
              // Progress will auto-hide after completion
            }}
          />
        ) : (
          <LoadingSection isVisible={isLoading} />
        )}
        
        <ResultsSection 
          results={results}
          isVisible={!!results && !isLoading && !isVisible}
        />
        
        <VerificationSection 
          results={results}
          isVisible={!!results && !isLoading && !isVisible}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  mainContent: {
    background: 'white',
    borderRadius: '20px',
    padding: '3rem',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  oracleButtonContainer: {
    position: 'fixed' as const,
    top: '2rem',
    right: '2rem',
    zIndex: 1000,
  },
  oracleButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,
};
