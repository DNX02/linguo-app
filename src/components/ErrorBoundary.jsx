import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '32px 20px',
          maxWidth: '480px',
          margin: '40px auto',
          background: 'rgba(30, 41, 59, 0.95)',
          borderRadius: '20px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f8fafc',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🦉⚠️</div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#fca5a5' }}>
            Произошла ошибка при загрузке
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '16px' }}>
            {this.state.error?.message || 'Неизвестная ошибка'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              background: '#58cc02',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              borderBottom: '4px solid #46a302'
            }}
          >
            Перезагрузить приложение
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
