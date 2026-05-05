import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const innerXSpring = useSpring(cursorX, { damping: 40, stiffness: 400 });
  const innerYSpring = useSpring(cursorY, { damping: 40, stiffness: 400 });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 bg-ink/10 rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          x: '-50%',
          y: '-50%',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-ink rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
        style={{
          translateX: innerXSpring,
          translateY: innerYSpring,
          x: '-50%',
          y: '-50%',
        }}
      />
    </>
  );
}
