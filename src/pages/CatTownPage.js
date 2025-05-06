import React, { useState, useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyles from "../styles/GlobalStyles";
import TownGrid from "../components/TownGrid/TownGrid";
import BuildingsPanel from "../components/BuildingsPanel/BuildingsPanel";
import { buildings } from "../data/buildings";
import avatarFace from "../assets/avatar-face.png";

const theme = {
  colors: {
    primary: "#4a3c28",
    secondary: "#6b563f",
    background: "#f8f8f8",
    accent: "#8b7355",
  },
};

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 32px 0;
  background: ${(props) => props.theme.colors.background};
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const MainContent = styled.div`
  display: flex;
  gap: 48px;
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const ActionButton = styled.button`
  padding: 10px 32px;
  font-size: 1.2rem;
  border-radius: 8px;
  border: none;
  background: #e0e0e0;
  color: #888;
  font-weight: 600;
  cursor: not-allowed;
  opacity: 0.7;
  transition: background 0.2s, transform 0.1s;
  &:active {
    transform: scale(0.97);
  }
`;

const BigButton = styled.button`
  min-width: 180px;
  height: 59px;
  border-radius: 7px;
  font-size: 1.1rem;
  font-weight: 700;
  border: 3px solid #8080804c;
  background: #fff;
  color: #333;
  padding: 14px 36px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: background 0.2s, transform 0.2s;
  cursor: pointer;
  display: block;
  &:hover {
    background: #f5f5f5;
    transform: scale(1.04);
  }
  &:active {
    transform: scale(0.97);
  }
`;

const GridWrapper = styled.div`
  position: relative;
`;

const SpeechBubble = styled.div`
  margin: 24px auto 0 auto;
  padding: 8px 24px;
  background: #fff;
  border-radius: 24px;
  border: 2px solid #bbb;
  font-size: 1.3rem;
  color: #444;
  width: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
`;

const SavedMessage = styled.span`
  margin-left: 16px;
  color: #458445;
  font-weight: bold;
  font-size: 1.1rem;
  transition: opacity 0.3s;
`;

const Avatar = styled.img`
  display: block;
  margin: 0 auto;
  width: 180px;
  height: auto;
  margin-top: 0;
  margin-bottom: 0;
`;

function CatTownPage() {
  // Load from localStorage if available
  const getInitialBuildings = () => {
    const saved = localStorage.getItem("catTownBuildings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return buildings;
      }
    }
    return buildings;
  };

  const [townBuildings, setTownBuildings] = useState(getInitialBuildings);
  const [gridSize] = useState({ rows: 5, cols: 5 });
  const townGridRef = useRef(null);
  const [showSaved, setShowSaved] = useState(false);
  const [confirmAnim, setConfirmAnim] = useState(false);

  // --- Add canPlaceAtCell logic here (copied from TownGrid, but using townBuildings) ---
  const canPlaceAtCell = (cellId, activeId) => {
    if (!activeId || !cellId) return null;
    const activeBuilding = townBuildings.find((b) => b.id === activeId);
    if (!activeBuilding) return null;
    const [startRow, startCol] = cellId.split("-").map(Number);
    const rows = activeBuilding.size?.rows || 1;
    const cols = activeBuilding.size?.cols || 1;
    // Check for out of bounds or overlap
    for (let dr = 0; dr < rows; dr++) {
      for (let dc = 0; dc < cols; dc++) {
        const checkRow = startRow + dr;
        const checkCol = startCol + dc;
        if (checkRow >= gridSize.rows || checkCol >= gridSize.cols) {
          return false;
        }
        const cellId = `${checkRow}-${checkCol}`;
        // Don't count the building being moved
        const occupying = townBuildings.find(
          (b) => b.position === cellId && b.id !== activeId
        );
        if (occupying) return false;
      }
    }
    // Stacking rule: for each cell the building would occupy
    for (let dr = 0; dr < rows; dr++) {
      for (let dc = 0; dc < cols; dc++) {
        const checkRow = startRow + dr;
        const checkCol = startCol + dc;
        // If on bottom row, allow
        if (checkRow === gridSize.rows - 1) continue;
        // Otherwise, check if there is a building directly below
        const belowOccupied = townBuildings.some((b) => {
          if (!b.position) return false;
          const [bRow, bCol] = b.position.split("-").map(Number);
          const bRows = b.size?.rows || 1;
          const bCols = b.size?.cols || 1;
          return (
            checkRow + 1 >= bRow &&
            checkRow + 1 < bRow + bRows &&
            checkCol >= bCol &&
            checkCol < bCol + bCols
          );
        });
        if (!belowOccupied) return false;
      }
    }
    return true;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      if (over.id === "available-buildings-panel") {
        setTownBuildings(
          townBuildings.map((building) =>
            building.id === active.id
              ? { ...building, position: null }
              : building
          )
        );
      } else {
        // Multi-cell placement logic (origin is bottom-left, grows up and right)
        const activeBuilding = townBuildings.find((b) => b.id === active.id);
        const [originRow, originCol] = over.id.split("-").map(Number);
        const rows = activeBuilding.size?.rows || 1;
        const cols = activeBuilding.size?.cols || 1;
        // Check for out of bounds or overlap (new convention)
        let canPlace = true;
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
              canPlace = false;
            }
            const cellId = `${checkRow}-${checkCol}`;
            // Don't count the building being moved
            const occupying = townBuildings.find(
              (b) => b.position === cellId && b.id !== active.id
            );
            if (occupying) canPlace = false;
          }
        }
        if (!canPlace) return;
        setTownBuildings(
          townBuildings.map((building) =>
            building.id === active.id
              ? { ...building, position: over.id }
              : building
          )
        );
      }
    } else {
      // If dropped outside the grid, return to available buildings
      setTownBuildings(
        townBuildings.map((building) =>
          building.id === active.id ? { ...building, position: null } : building
        )
      );
    }
  };

  const handleReset = () => {
    setTownBuildings(
      buildings.map((building) => ({ ...building, position: null }))
    );
    localStorage.removeItem("catTownBuildings");
  };

  // Confirm logic
  const handleConfirm = () => {
    localStorage.setItem("catTownBuildings", JSON.stringify(townBuildings));
    const placedBuildings = townBuildings.filter((b) => b.position);
    console.log("Confirmed grid:", placedBuildings);
    setConfirmAnim(true);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 1500);
    setTimeout(() => setConfirmAnim(false), 200);
  };
  const isConfirmEnabled = townBuildings.some((b) => b.position);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <DndContext onDragEnd={handleDragEnd}>
        <PageContainer>
          <MainContent>
            <LeftPanel>
              <ButtonRow>
                <BigButton
                  style={
                    isConfirmEnabled
                      ? {
                          background: "#458445",
                          color: "white",
                          border: "3px solid #458445",
                          cursor: "pointer",
                          opacity: 1,
                          transform: confirmAnim ? "scale(0.95)" : "scale(1)",
                        }
                      : {
                          background: "#e0e0e0",
                          color: "#888",
                          border: "3px solid #e0e0e0",
                          cursor: "not-allowed",
                          opacity: 0.7,
                        }
                  }
                  disabled={!isConfirmEnabled}
                  onClick={isConfirmEnabled ? handleConfirm : undefined}
                >
                  Confirm
                </BigButton>
                <BigButton onClick={handleReset}>Reset Town</BigButton>
                {showSaved && <SavedMessage>Saved!</SavedMessage>}
              </ButtonRow>
              <GridWrapper>
                <TownGrid
                  ref={townGridRef}
                  buildings={townBuildings}
                  gridSize={gridSize}
                />
              </GridWrapper>
              <Avatar src={avatarFace} alt="Avatar" />
              <SpeechBubble>......</SpeechBubble>
            </LeftPanel>
            <BuildingsPanel
              buildings={townBuildings.filter((b) => !b.position)}
              onReset={handleReset}
            />
          </MainContent>
        </PageContainer>
      </DndContext>
    </ThemeProvider>
  );
}

export default CatTownPage;
