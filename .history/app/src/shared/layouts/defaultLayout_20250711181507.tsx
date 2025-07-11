import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/navbar/Navbar';

interface DefaultLayoutProps {
  children?: React.ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 lg:pt-0 pb-20 lg:pb-0">
        {children || <Outlet />}
      </main>
    </div>
  );
}