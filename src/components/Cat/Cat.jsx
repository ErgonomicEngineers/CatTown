import React from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";
import useCatMovement from "../../hooks/useCatMovement";

const CatEmoji = styled(animated.div)`
  position: absolute;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

const Cat = ({ gridRef }) => {
  const position = useCatMovement(gridRef);

  const props = useSpring({
    to: { left: position.x, top: position.y },
    config: { tension: 120, friction: 14 },
  });

  return <CatEmoji style={props}>🐱</CatEmoji>;
};

export default Cat;
