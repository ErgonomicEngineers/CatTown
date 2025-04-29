import React from "react";
import styled from "styled-components";
import { useDroppable } from "@dnd-kit/core";

const Cell = styled.div`
  aspect-ratio: 1;
  width: 100px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #458445;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }
`;

const GridCell = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return <Cell ref={setNodeRef}>{children}</Cell>;
};

export default GridCell;
