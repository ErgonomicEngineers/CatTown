import React, { forwardRef } from "react";
import styled from "styled-components";
import GridCell from "./GridCell";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  padding: 0;
  background: #90ee90;
  border-radius: 12px;
  border: 4px solid #458445;
  position: relative;
  width: fit-content;
  margin: 20px auto;
`;

const Building = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  .emoji {
    font-size: 2.5rem;
  }

  .name {
    font-size: 0.8rem;
    text-align: center;
  }
`;

const TownGrid = forwardRef(({ buildings, gridSize }, ref) => {
  const renderGrid = () => {
    const grid = [];

    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const cellId = `${row}-${col}`;
        const buildingHere = buildings.find((b) => b.position === cellId);

        grid.push(
          <GridCell key={cellId} id={cellId}>
            {buildingHere && (
              <Building>
                <span className="emoji">{buildingHere.emoji}</span>
                <span className="name">{buildingHere.name}</span>
              </Building>
            )}
          </GridCell>
        );
      }
    }

    return grid;
  };

  return <GridContainer ref={ref}>{renderGrid()}</GridContainer>;
});

export default TownGrid;
