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
      <h2 style={styles.title}>Descreva seu negócio</h2>
      <p style={styles.description}>
        Conte-nos sobre sua ideia ou negócio para que possamos analisar o mercado e fornecer insights
        valiosos da comunidade Web3.
      </p>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="businessDescription" style={styles.label}>
            Descrição do seu negócio ou ideia:
          </label>
          <textarea
            id="businessDescription"
            style={styles.textarea}
            placeholder="Ex: Preciso avaliar no mercado os interesses por verificação de media e conteúdo na blockchain, também sobre a necessidade de comprovação e validação de media como autenticas e não geradas por IA..."
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
          <span>{isLoading ? '⏳ Analisando...' : '🔍 Analisar Mercado'}</span>
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
};
