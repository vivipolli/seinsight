import React, { useState } from 'react';

interface InputSectionProps {
  onSubmit: (businessDescription: string) => void;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
}) => {
  const [businessDescription, setBusinessDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(businessDescription);
  };

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onClearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, onClearError]);

  return (
    <div style={styles.inputSection}>
      <h2 style={styles.title}>Describe your business</h2>
      <p style={styles.description}>
        Tell us about your idea or business so we can analyze the market and provide valuable insights
        from the Web3 community.
      </p>

      <div style={styles.performanceNotice}>
        <strong>⏱️ Processing Time Notice:</strong> Our AI agents may take 3-10 minutes to complete the analysis. 
        We're actively working to improve performance and reduce processing times. Thank you for your patience!
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="businessDescription" style={styles.label}>
            Description of your business or idea:
          </label>
          <textarea
            id="businessDescription"
            style={styles.textarea}
            placeholder="Ex: I need to evaluate market interest in media and content verification on blockchain, also about the need for proof and validation of media as authentic and not AI-generated..."
            value={businessDescription}
            onChange={(e) => setBusinessDescription((e.target as HTMLTextAreaElement).value)}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.submitBtn,
            ...(isLoading ? styles.submitBtnDisabled : {}),
          }}
          disabled={isLoading}
        >
          <span>{isLoading ? '⏳ Analyzing...' : '🔍 Analyze Market'}</span>
        </button>
      </form>
    </div>
  );
};

const styles = {
  inputSection: {
    marginBottom: '3rem',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: '#2d3748',
    fontWeight: 600,
  },
  description: {
    color: '#718096',
    marginBottom: '2rem',
    fontSize: '1.1rem',
  },
  error: {
    background: '#fed7d7',
    color: '#c53030',
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid #feb2b2',
    marginBottom: '1rem',
  },
  formGroup: {
    marginBottom: '2rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
    color: '#2d3748',
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontFamily: 'inherit',
    fontSize: '1rem',
    resize: 'vertical' as const,
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
  },
  performanceNotice: {
    background: '#e2e8f0',
    color: '#4a5568',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },
};
