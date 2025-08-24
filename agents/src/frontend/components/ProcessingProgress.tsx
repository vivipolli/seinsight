import React, { useState, useEffect } from 'react';

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface ProcessingProgressProps {
  isVisible: boolean;
  currentStep?: string;
  onComplete?: () => void;
}

export const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
  isVisible,
  currentStep,
  onComplete
}) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    {
      id: 'hashtags',
      title: 'Generating Hashtags',
      description: 'Analyzing business description to create relevant search terms',
      icon: '🏷️',
      status: 'pending'
    },
    {
      id: 'twitter',
      title: 'Collecting Community Data',
      description: 'Gathering real conversations from Twitter community',
      icon: '🐦',
      status: 'pending'
    },
    {
      id: 'blockchain',
      title: 'Publishing to Blockchain',
      description: 'Storing signals immutably on SEI blockchain oracle',
      icon: '⛓️',
      status: 'pending'
    },
    {
      id: 'analysis',
      title: 'Community Analysis',
      description: 'Analyzing sentiment and generating market insights',
      icon: '📊',
      status: 'pending'
    }
  ]);

  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      // Reset when hidden
      setSteps(steps.map(step => ({ ...step, status: 'pending' as const })));
      setCompletedSteps(0);
      return;
    }

    // Update current step based on currentStep prop
    const updatedSteps = steps.map(step => {
      if (step.id === currentStep) {
        return { ...step, status: 'active' as const };
      } else if (completedSteps > 0 && steps.indexOf(step) < completedSteps) {
        return { ...step, status: 'completed' as const };
      } else if (completedSteps > 0 && steps.indexOf(step) > completedSteps) {
        return { ...step, status: 'pending' as const };
      }
      return step;
    });

    setSteps(updatedSteps);
  }, [isVisible, currentStep, completedSteps]);

  useEffect(() => {
    if (!isVisible) return;

    // Simulate step progression based on currentStep
    const stepIndex = steps.findIndex(step => step.id === currentStep);
    if (stepIndex >= 0) {
      setCompletedSteps(stepIndex);
    }

    // Auto-complete all steps when analysis step is reached
    if (currentStep === 'analysis') {
      setSteps(steps.map(step => ({ ...step, status: 'completed' as const })));
      setCompletedSteps(steps.length);
    }
  }, [currentStep, isVisible, onComplete]);

  if (!isVisible) return null;

  const styles = {
    container: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#000000',
      textAlign: 'center' as const,
      marginBottom: '1.5rem',
    },
    stepsContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
    },
    step: {
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    stepPending: {
      background: 'rgba(255, 255, 255, 0.02)',
      opacity: 0.7,
    },
    stepActive: {
      background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.15) 0%, rgba(255, 165, 0, 0.15) 100%)',
      border: '1px solid rgba(255, 140, 0, 0.4)',
      boxShadow: '0 4px 16px rgba(255, 140, 0, 0.3)',
      opacity: 1,
    },
    stepCompleted: {
      background: 'rgba(76, 175, 80, 0.15)',
      border: '1px solid rgba(76, 175, 80, 0.4)',
      opacity: 1,
    },
    icon: {
      fontSize: '1.5rem',
      marginRight: '1rem',
      width: '40px',
      textAlign: 'center' as const,
    },
    content: {
      flex: 1,
    },
    stepTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      marginBottom: '0.25rem',
      color: '#333333',
    },
    stepDescription: {
      fontSize: '0.875rem',
      color: '#666666',
    },
    statusIcon: {
      fontSize: '1.25rem',
      marginLeft: '1rem',
    },
    progressBar: {
      width: '100%',
      height: '4px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '2px',
      marginTop: '1rem',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #ff5e5d 0%, #ff8a8a 100%)',
      borderRadius: '2px',
      transition: 'width 0.5s ease',
    },
  };

  const getStepStyle = (step: ProcessingStep) => {
    const baseStyle = { ...styles.step };
    
    switch (step.status) {
      case 'active':
        return { ...baseStyle, ...styles.stepActive };
      case 'completed':
        return { ...baseStyle, ...styles.stepCompleted };
      default:
        return { ...baseStyle, ...styles.stepPending };
    }
  };

  const getStatusIcon = (step: ProcessingStep) => {
    switch (step.status) {
      case 'active':
        return (
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid #ff8c00',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        );
      case 'completed':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏸️';
    }
  };

  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <h3 style={styles.title}>🔄 Processing Analysis</h3>
      
      <div style={styles.stepsContainer}>
        {steps.map((step) => (
          <div key={step.id} style={getStepStyle(step)}>
            <div style={styles.icon}>{step.icon}</div>
            <div style={styles.content}>
              <div style={styles.stepTitle}>{step.title}</div>
              <div style={styles.stepDescription}>{step.description}</div>
            </div>
            <div style={styles.statusIcon}>{getStatusIcon(step)}</div>
          </div>
        ))}
      </div>

      <div style={styles.progressBar}>
        <div 
          style={{ 
            ...styles.progressFill, 
            width: `${progressPercentage}%` 
          }} 
        />
      </div>
    </div>
  );
};
