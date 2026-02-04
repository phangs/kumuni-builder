/**
 * Utility functions for responsive scaling in the Kumuni Builder
 */

export interface CanvasDimensions {
  width: number;
  height: number;
  scale: number;
}

/**
 * Calculates optimal canvas dimensions based on available space
 * @param containerWidth Width of the container holding the canvas
 * @param containerHeight Height of the container holding the canvas
 * @returns Canvas dimensions with appropriate scaling
 */
export const calculateCanvasDimensions = (
  containerWidth: number,
  containerHeight: number
): CanvasDimensions => {
  // Original canvas dimensions (mobile device)
  const originalWidth = 360;
  const originalHeight = 700;
  
  // Calculate scale factors for both width and height
  const scaleX = (containerWidth * 0.9) / originalWidth; // 90% of container width
  const scaleY = (containerHeight * 0.8) / originalHeight; // 80% of container height
  
  // Use the smaller scale to ensure the canvas fits in both dimensions
  const scale = Math.min(scaleX, scaleY, 1); // Cap at 1 (100%) to avoid oversized canvas
  
  // Calculate final dimensions
  const width = originalWidth * scale;
  const height = originalHeight * scale;
  
  return {
    width,
    height,
    scale
  };
};

/**
 * Gets the appropriate mobile frame class based on screen size
 * @param screenWidth Current screen width
 * @returns Tailwind class string for mobile frame
 */
export const getMobileFrameClass = (screenWidth: number): string => {
  if (screenWidth >= 1920) {
    return 'w-[400px] h-[800px]'; // Larger for 4K screens
  } else if (screenWidth >= 1600) {
    return 'w-[380px] h-[750px]'; // Slightly larger for high-res laptops
  } else if (screenWidth >= 1280) {
    return 'w-[360px] h-[700px]'; // Standard size
  } else {
    return 'w-[340px] h-[650px]'; // Smaller for compact screens
  }
};