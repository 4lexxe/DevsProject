import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '5rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
        Lo sentimos, la página que buscas no existe.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default NotFound;
