import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  // Use MotionValues directly for absolute 0-latency tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Use a highly responsive spring just for the scale/hover animations
  const scale = useSpring(1, { damping: 25, stiffness: 350 });
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Direct GPU-accelerated coordinate assignment
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Detect if we are hovering over anything clickable
      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.closest('a') || 
        target.closest('button');
        
      if (isClickable) {
        scale.set(1.5); // Smoothly grow shadow
      } else {
        scale.set(1);   // Return to default
      }
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleInteraction, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleInteraction);
    };
  }, [isVisible, cursorX, cursorY, scale]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        scale,
        // Using negative margins for centering perfectly avoids Framer Motion's internal matrix conflicts with x/y
        marginLeft: '-16px',
        marginTop: '-16px',
      }}
    >
      {/* Premium studio-grade shadow design */}
      <div className="w-full h-full rounded-full bg-ink/[0.15] border border-ink/[0.05] shadow-[0_0_10px_rgba(0,0,0,0.05)] backdrop-blur-[2px] transition-all duration-300 ease-out" />
    </motion.div>
  );
}
