import React, { useRef, useState, useEffect } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
}

export default function MagneticButton({
  children,
  className = '',
  magneticStrength = 0.2,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoverable, setIsHoverable] = useState(true);

  useEffect(() => {
    // Only apply magnetic effect on devices with a fine pointer (like a mouse)
    setIsHoverable(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isHoverable) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * magneticStrength, y: middleY * magneticStrength });
  };

  const reset = () => {
    if (!isHoverable) return;
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
