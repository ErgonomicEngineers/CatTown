import React from "react";
import styled, { css } from "styled-components";
import { useDroppable } from "@dnd-kit/core";

const highlightStyles = {
  green: {
    background: "#b6fcb6cc",
    border: "2px solid #1ec31e",
  },
  red: {
    background: "#ffb6b6cc",
    border: "2px solid #e74c3c",
  },
  yellow: {
    background: "#ffe06699",
    border: "2px solid #ffae00",
  },
};

const Cell = styled.div`
  min-width: 0;
  min-height: 0;
  background: transparent;
  border: ${(props) => (props.$hideBorder ? "none" : "1px solid #e0e0e0")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$hideBorder ? "transparent" : "rgba(245, 245, 245, 0.9)"};
    border-color: ${(props) => (props.$hideBorder ? "none" : "#999")};
  }

  ${(props) =>
    props.$highlight &&
    css`
      background: ${props.$highlightColor
        ? highlightStyles[props.$highlightColor].background
        : highlightStyles.yellow.background};
      border: ${props.$highlightColor
        ? highlightStyles[props.$highlightColor].border
        : highlightStyles.yellow.border};
      z-index: 1;
    `}
`;

const GridCell = ({
  id,
  children,
  style,
  canPlace,
  highlight,
  highlightColor,
  hideBorder = false,
}) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Cell
      ref={setNodeRef}
      style={style}
      data-droppable-id={id}
      $highlight={highlight}
      $highlightColor={highlightColor}
      $hideBorder={hideBorder}
    >
      {children}
    </Cell>
  );
};

export default GridCell;
