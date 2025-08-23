import React, { useState, useEffect } from 'react';
import { SeinsightService } from '../services/SeinsightService';

interface OracleNotification {
  id: string;
  type: 'transaction' | 'status' | 'activity';
  title: string;
  message: string;
  timestamp: Date;
  txHash?: string;
  batchId?: number;
  signals?: string[];
}

interface OracleNotificationsProps {
  isVisible: boolean;
  onClose: () => void;
}

export const OracleNotifications: React.FC<OracleNotificationsProps> = ({ isVisible, onClose }) => {
  const [oracleInfo, setOracleInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const seinsightService = new SeinsightService();

  const fetchOracleInfo = async () => {
    setIsLoading(true);
    try {
      // Use SeinsightService to call the oracle status action
      const response = await fetch('http://localhost:3000/api/messaging/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: '3643e20d-b322-0e3e-a089-87f323dc94ad', // InsightCompiler
          userId: '550e8400-e29b-41d4-a716-446655440000',
          metadata: { platform: "frontend", purpose: "oracle-status" }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create oracle session');
      }

      const sessionData = await response.json();
      const sessionId = sessionData.sessionId;

      // Send oracle status request
      await fetch(`http://localhost:3000/api/messaging/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'oracle status' })
      });

      // Wait for response
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Get messages
      const messagesResponse = await fetch(`http://localhost:3000/api/messaging/sessions/${sessionId}/messages`);
      const messagesData = await messagesResponse.json();

      if (messagesData.messages) {
        const agentMessages = messagesData.messages.filter((msg: any) => msg.isAgent);
        if (agentMessages.length > 0) {
          const agentResponse = agentMessages[agentMessages.length - 1].content;
          setOracleInfo(agentResponse);
        } else {
          setOracleInfo('No oracle information available');
        }
      }

      // Clean up session
      await fetch(`http://localhost:3000/api/messaging/sessions/${sessionId}`, { method: 'DELETE' });

    } catch (error) {
      console.error('Oracle info error:', error);
      setOracleInfo('❌ Error loading oracle information');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchOracleInfo();
    }
  }, [isVisible]);



  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '2rem',
      right: '2rem',
      zIndex: 1000,
      width: '500px',
      maxHeight: '600px',
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: 0
        }}>
          🔮 Oracle Status
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        marginBottom: '1rem'
      }}>
        {isLoading ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            <p>Loading oracle information...</p>
          </div>
        ) : oracleInfo ? (
          <div style={{
            background: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              whiteSpace: 'pre-wrap',
              fontSize: '0.875rem',
              lineHeight: '1.5',
              color: '#374151',
              fontFamily: 'monospace'
            }}>
              {oracleInfo}
            </div>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔮</div>
            <p>No oracle information available</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb',
        fontSize: '0.75rem',
        color: '#6b7280'
      }}>
        <span>🔮 Sei Oracle</span>
        <button
          onClick={fetchOracleInfo}
          style={{
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            cursor: 'pointer',
            fontSize: '0.75rem',
            textDecoration: 'underline'
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};
