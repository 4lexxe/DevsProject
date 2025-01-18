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
  const props = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(50px)' },
  });

  return (
    <animated.div style={props} className="relative z-10 w-full max-w-4xl mx-auto text-center">
      <h1 className="mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
        {headerSection.title}
      </h1>
      <h2 className="mb-4 text-xl px-5 py-1 bg-black/10 rounded-lg sm:text-2xl md:text-3xl text-[#00D7FF]">
        {headerSection.slogan}
      </h2>
      <p className="mb-8 text-sm sm:text-base md:text-lg text-white max-w-2xl mx-auto">
        {headerSection.about}
      </p>
      <ActionButton href={headerSection.buttonLink}>
        {headerSection.buttonName}
      </ActionButton>
    </animated.div>
  );
}