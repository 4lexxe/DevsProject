import React from 'react';
import { useSpring, animated } from 'react-spring';
import ActionButton from '../buttons/ActionButton';

interface HeaderSection {
  image: string;
  title: string;
  slogan: string;
  about: string;
  buttonName: string;
  buttonLink: string;
}

interface HeroContentProps {
  headerSection: HeaderSection;
}

export default function HeroContent({ headerSection }: HeroContentProps) {
  const fadeIn = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(50px)' },
  });

  return (
    <animated.div 
      style={fadeIn} 
      className="relative z-10 w-full max-w-4xl mx-auto text-center px-4"
    >
      <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
        {headerSection.title}
      </h1>
      
      {/* Slogan with green accent line */}
      <div className="relative inline-block mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFFF]" />
        <h2 className="pl-4 text-xl sm:text-2xl md:text-3xl text-[#00D7FF] text-left">
          {headerSection.slogan}
        </h2>
      </div>

      <p className="mb-8 text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto">
        {headerSection.about}
      </p>

      <div className="space-y-8">
        <ActionButton 
          href={headerSection.buttonLink}>
          {headerSection.buttonName}
        </ActionButton>
      </div>
    </animated.div>
  );
}