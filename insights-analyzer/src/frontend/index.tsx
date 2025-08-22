import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/seinsight.css';
import React from 'react';
import type { UUID } from '@elizaos/core';
import { SeinsightApp } from './components/SeinsightApp';

const queryClient = new QueryClient();

// Define the interface for the ELIZA_CONFIG
interface ElizaConfig {
  agentId: string;
  apiBase: string;
}

/**
 * Main Example route component
 */
function ExampleRoute() {
  const config = window.ELIZA_CONFIG;
  const agentId = config?.agentId;

  // Remove dark mode for Seinsight App (uses its own styling)
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  if (!agentId) {
    return <SeinsightApp />;
  }

  return <ExampleProvider agentId={agentId as UUID} />;
}

/**
 * Example provider component
 */
function ExampleProvider({ agentId }: { agentId: UUID }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SeinsightApp />
    </QueryClientProvider>
  );
}

// Initialize the application - no router needed for iframe
if (typeof document !== 'undefined') {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(<ExampleRoute />);
  }
}

// Define types for integration with agent UI system
export interface AgentPanel {
  name: string;
  path: string;
  component: React.ComponentType<any>;
  icon?: string;
  public?: boolean;
  shortLabel?: string; // Optional short label for mobile
}

interface PanelProps {
  agentId: string;
}

/**
 * Example panel component for the plugin system
 */
const PanelComponent: React.FC<PanelProps> = ({ agentId }) => {
  return <div>Helllo {agentId}!</div>;
};

// Export the panel configuration for integration with the agent UI
export const panels: AgentPanel[] = [
  {
    name: 'Example',
    path: 'example',
    component: PanelComponent,
    icon: 'Book',
    public: false,
    shortLabel: 'Example',
  },
];

export * from './utils';
