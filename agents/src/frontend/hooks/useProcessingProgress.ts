import { useState, useCallback } from 'react';

export type ProcessingStep = 'hashtags' | 'twitter' | 'blockchain' | 'analysis';

export const useProcessingProgress = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<ProcessingStep | undefined>();

  const startProcessing = useCallback(() => {
    setIsVisible(true);
    setCurrentStep('hashtags');
  }, []);

  const setStep = useCallback((step: ProcessingStep) => {
    setCurrentStep(step);
  }, []);

  const completeProcessing = useCallback(() => {
    setCurrentStep('analysis');
    // Auto-hide after completion
    setTimeout(() => {
      setIsVisible(false);
      setCurrentStep(undefined);
    }, 3000);
  }, []);

  const resetProcessing = useCallback(() => {
    setIsVisible(false);
    setCurrentStep(undefined);
  }, []);

  return {
    isVisible,
    currentStep,
    startProcessing,
    setStep,
    completeProcessing,
    resetProcessing
  };
};
