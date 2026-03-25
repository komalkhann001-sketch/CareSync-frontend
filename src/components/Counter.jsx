import React, { useEffect, useRef } from 'react';
import { useSpring, useMotionValue, animate } from 'framer-motion';

const Counter = ({ target }) => {
  const count = useMotionValue(0);
  const rounded = useSpring(count, { stiffness: 40, damping: 20 });
  const displayValue = useRef(null);

  useEffect(() => {
    const animation = animate(count, target, { duration: 2 });
    return animation.stop;
  }, [target, count]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (displayValue.current) {
        displayValue.current.textContent = Math.round(latest);
      }
    });
  }, [rounded]);

  return <span ref={displayValue}>0</span>;
};

export default Counter;
