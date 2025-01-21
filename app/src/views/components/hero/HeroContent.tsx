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
    config: { duration: 500 }
  });

  return (
    <animated.div 
      style={fadeIn} 
      className="w-full max-w-4xl mx-auto text-center"
    >
      <div className="flex flex-col items-center justify-center h-full space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          {headerSection.title}
        </h1>
        
        <div className="relative inline-block">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFFF]" />
          <h2 className="pl-4 text-xl sm:text-2xl md:text-3xl text-[#00D7FF] text-left">
            {headerSection.slogan}
          </h2>
        </div>

        <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl">
          {headerSection.about}
        </p>

        <div>
          <ActionButton href={headerSection.buttonLink}>
            {headerSection.buttonName}
          </ActionButton>
        </div>
      </div>
    </animated.div>
  );
}