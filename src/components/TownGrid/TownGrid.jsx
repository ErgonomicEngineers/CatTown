import React, { forwardRef, useState, useCallback } from "react";
import styled from "styled-components";
import GridCell from "./GridCell";
import DraggableItem from "../DraggableItem/DraggableItem";
import { useDndContext } from "@dnd-kit/core";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  padding: 0;
  background: #fff;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  position: relative;
  width: fit-content;
  margin: 20px auto;
`;

const TownGrid = forwardRef(({ buildings, gridSize }, ref) => {
  const { active, over } = useDndContext();
  const [dragOverCell, setDragOverCell] = useState(null);

  // Build a map of covered cells for multi-cell buildings (origin is bottom-left, grows up and right)
  const coveredCells = new Set();
  buildings.forEach((b) => {
    if (!b.position) return;
    const [originRow, originCol] = b.position.split("-").map(Number);
    const rows = b.size?.rows || 1;
    const cols = b.size?.cols || 1;
    for (let dr = 0; dr < rows; dr++) {
      for (let dc = 0; dc < cols; dc++) {
        const cellRow = originRow - dr;
        const cellCol = originCol + dc;
        // Only the origin cell is not covered
        if (!(dr === 0 && dc === 0)) {
          coveredCells.add(`${cellRow}-${cellCol}`);
        }
      }
    }
  });

  const canPlaceAtCell = useCallback(
    (cellId) => {
      if (!active) {
        console.log("Early return: no active");
        return null;
      }
      if (!cellId) {
        console.log("Early return: no cellId");
        return null;
      }

      const activeBuilding = buildings.find((b) => b.id === active.id);
      if (!activeBuilding) {
        console.log("Early return: no activeBuilding");
        return null;
      }

      console.log("TEST LOG");

      const [originRow, originCol] = cellId.split("-").map(Number);
      const rows = activeBuilding.size?.rows || 1;
      const cols = activeBuilding.size?.cols || 1;

      // The building grows UP and to the RIGHT from the origin (bottom-left)
      // So it occupies (originRow - dr, originCol + dc) for dr in 0..rows-1, dc in 0..cols-1
      // The lowest row is originRow, the highest is originRow - (rows-1)
      // The leftmost col is originCol, the rightmost is originCol + (cols-1)

      // Collect all cells the building will occupy
      const occupiedCells = [];
      for (let dr = 0; dr < rows; dr++) {
        for (let dc = 0; dc < cols; dc++) {
          const checkRow = originRow - dr;
          const checkCol = originCol + dc;
          occupiedCells.push(`${checkRow}-${checkCol}`);
        }
      }
      console.log(
        "Trying to place building:",
        activeBuilding.name,
        "at origin:",
        originRow,
        originCol
      );
      console.log("Occupied cells:", occupiedCells);

      // Check for out of bounds or overlap
      for (let dr = 0; dr < rows; dr++) {
        for (let dc = 0; dc < cols; dc++) {
          const checkRow = originRow - dr;
          const checkCol = originCol + dc;
          if (
            checkRow < 0 ||
            checkCol < 0 ||
            checkRow >= gridSize.rows ||
            checkCol >= gridSize.cols
          ) {
            console.log("Out of bounds:", checkRow, checkCol);
            return false;
          }
          const cellId = `${checkRow}-${checkCol}`;
          // Don't count the building being moved
          const occupying = buildings.find(
            (b) => b.position === cellId && b.id !== active.id
          );
          if (occupying) {
            console.log("Overlap at:", cellId, "with", occupying.name);
            return false;
          }
        }
      }

      // Stacking rule: for each column the building would occupy, check only the bottom-most cell (originRow, originCol+dc)
      for (let dc = 0; dc < cols; dc++) {
        const bottomRow = originRow;
        const checkCol = originCol + dc;
        // If on bottom row, allow
        if (bottomRow === gridSize.rows - 1) {
          console.log(`Column ${checkCol}: on bottom row, stacking OK`);
          continue;
        }
        // Otherwise, check if there is a building directly below
        const belowRow = bottomRow + 1;
        let found = false;
        for (const b of buildings) {
          if (!b.position) continue;
          const [bRow, bCol] = b.position.split("-").map(Number);
          const bRows = b.size?.rows || 1;
          const bCols = b.size?.cols || 1;
          for (let dr = 0; dr < bRows; dr++) {
            for (let dc2 = 0; dc2 < bCols; dc2++) {
              if (bRow - dr === belowRow && bCol + dc2 === checkCol) {
                found = true;
                break;
              }
            }
            if (found) break;
          }
          if (found) break;
        }
        console.log(
          `Stacking check for (${belowRow},${checkCol}):`,
          found ? "OK" : "FAIL"
        );
        if (!found) return false;
      }

      return true;
    },
    [active, buildings, gridSize]
  );

  // Restore dragOverCell logic
  React.useEffect(() => {
    if (over && over.id !== "available-buildings-panel") {
      setDragOverCell(over.id);
    } else {
      setDragOverCell(null);
    }
  }, [over]);

  // Compute highlightCells: the set of cells the building would occupy if dropped at dragOverCell
  let highlightCells = new Set();
  let highlightColor = undefined;
  if (active && dragOverCell) {
    const activeBuilding = buildings.find((b) => b.id === active.id);
    if (activeBuilding) {
      const [originRow, originCol] = dragOverCell.split("-").map(Number);
      const rows = activeBuilding.size?.rows || 1;
      const cols = activeBuilding.size?.cols || 1;
      for (let dr = 0; dr < rows; dr++) {
        for (let dc = 0; dc < cols; dc++) {
          const checkRow = originRow - dr;
          const checkCol = originCol + dc;
          if (
            checkRow >= 0 &&
            checkCol >= 0 &&
            checkRow < gridSize.rows &&
            checkCol < gridSize.cols
          ) {
            highlightCells.add(`${checkRow}-${checkCol}`);
          }
        }
      }
      // Compute canPlace for the dragOverCell and set highlightColor for all highlightCells
      const canPlace = canPlaceAtCell(dragOverCell);
      if (canPlace === true) highlightColor = "green";
      else if (canPlace === false) highlightColor = "red";
      else highlightColor = "yellow";
    }
  }

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < gridSize.rows; row++) {
      for (let col = 0; col < gridSize.cols; col++) {
        const cellId = `${row}-${col}`;
        // Skip rendering covered cells entirely
        if (coveredCells.has(cellId)) continue;
        // Only render a building if it's the origin cell (bottom-left)
        const buildingHere = buildings.find((b) => b.position === cellId);
        if (buildingHere) {
          const rows = buildingHere.size?.rows || 1;
          const cols = buildingHere.size?.cols || 1;
          const originRow = row;
          const originCol = col;
          grid.push(
            <GridCell
              key={cellId}
              id={cellId}
              style={{
                gridColumnStart: originCol + 1,
                gridColumnEnd: `span ${cols}`,
                gridRowStart: rows === 1 ? originRow + 1 : originRow - rows + 2,
                gridRowEnd: `span ${rows}`,
                zIndex: 2,
              }}
            >
              <DraggableItem
                id={buildingHere.id}
                name={buildingHere.name}
                emoji={buildingHere.emoji}
                size={buildingHere.size}
              />
            </GridCell>
          );
        } else {
          // Only show canPlace for the cell being hovered during drag
          const canPlace =
            active && dragOverCell === cellId ? canPlaceAtCell(cellId) : null;
          grid.push(
            <GridCell
              key={cellId}
              id={cellId}
              canPlace={canPlace}
              highlight={highlightCells.has(cellId)}
              highlightColor={
                highlightCells.has(cellId) ? highlightColor : undefined
              }
            />
          );
        }
      }
    }
    return grid;
  };

  return <GridContainer ref={ref}>{renderGrid()}</GridContainer>;
});

export default TownGrid;
