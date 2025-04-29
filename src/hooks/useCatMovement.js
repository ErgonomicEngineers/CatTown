import { useState, useEffect, useCallback } from "react";

const useCatMovement = (gridRef) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });

  const setRandomPosition = useCallback(() => {
    if (!gridRef.current) return null;

    const gridRect = gridRef.current.getBoundingClientRect();
    const catSize = 40;
    const padding = 20;

    return {
      x:
        gridRect.left +
        padding +
        Math.random() * (gridRect.width - catSize - padding * 2),
      y:
        gridRect.top +
        padding +
        Math.random() * (gridRect.height - catSize - padding * 2),
    };
  }, [gridRef]);

  useEffect(() => {
    const newPos = setRandomPosition();
    if (newPos) {
      setPosition(newPos);
      setTargetPosition(newPos);
    }
  }, [setRandomPosition]);

  useEffect(() => {
    if (!gridRef.current) return;

    const targetInterval = setInterval(() => {
      const newTarget = setRandomPosition();
      if (newTarget) setTargetPosition(newTarget);
    }, 5000);

    const moveInterval = setInterval(() => {
      setPosition((prev) => {
        const speed = 0.03;
        return {
          x: prev.x + (targetPosition.x - prev.x) * speed,
          y: prev.y + (targetPosition.y - prev.y) * speed,
        };
      });
    }, 50);

    return () => {
      clearInterval(targetInterval);
      clearInterval(moveInterval);
    };
  }, [setRandomPosition, targetPosition, gridRef]);

  return position;
};

export default useCatMovement;
