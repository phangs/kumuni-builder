import { useState, useEffect } from 'react';

interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
  isLargeScreen: boolean;
  isMediumScreen: boolean;
  isSmallScreen: boolean;
}

export const useScreenScaling = (): ScreenDimensions => {
  const [dimensions, setDimensions] = useState<ScreenDimensions>({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 1,
    isLargeScreen: window.innerWidth >= 1920,
    isMediumScreen: window.innerWidth >= 1280 && window.innerWidth < 1920,
    isSmallScreen: window.innerWidth < 1280,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Calculate scale based on screen size
      let scale = 1;
      if (width >= 2560) {
        scale = 1.25; // For 2K/4K screens
      } else if (width >= 1920) {
        scale = 1.15; // For Full HD+
      } else if (width >= 1600) {
        scale = 1.1;  // For larger laptops
      } else if (width <= 1024) {
        scale = 0.9;  // For smaller screens
      } else {
        scale = 1.0;  // Standard screens
      }

      setDimensions({
        width,
        height,
        scale,
        isLargeScreen: width >= 1920,
        isMediumScreen: width >= 1280 && width < 1920,
        isSmallScreen: width < 1280,
      });
    };

    // Initial calculation
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
};