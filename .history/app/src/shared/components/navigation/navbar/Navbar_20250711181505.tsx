import React from 'react';
import { useMediaQuery } from 'react-responsive';
import DesktopNavbar from './NavbarDesktop';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';

export default function Navbar() {
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  if (isDesktop) {
    return <DesktopNavbar />;
  }

  return (
    <>
      <TopNavbar />
      <BottomNavbar />
    </>
  );
}