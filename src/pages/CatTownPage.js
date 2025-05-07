import React, { useState, useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyles from "../styles/GlobalStyles";
import TownGrid from "../components/TownGrid/TownGrid";
import BuildingsPanel from "../components/BuildingsPanel/BuildingsPanel";
import { buildings } from "../data/buildings";
import avatarFace from "../assets/avatar-face.png";
import { useNavigate } from "react-router-dom";
import crossImage from "../assets/cross.png";

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
  background: white;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 116px;
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
  display: inline-flex;
  padding: 11px 54.182px 12.123px 55px;
  justify-content: center;
  align-items: center;
  border-radius: 14.229px;
  background: #eeeef3;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  color: #333;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: background 0.2s, transform 0.2s;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
    transform: scale(1.04);
  }
  &:active {
    transform: scale(0.97);
  }
`;

const ResetButton = styled.button`
  display: inline-flex;
  padding: 11px 71.182px 12.123px 72px;
  justify-content: center;
  align-items: center;
  border-radius: 14.229px;
  background: #212123;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: background 0.2s, transform 0.2s;
  cursor: pointer;
  &:hover {
    background: #333;
    transform: scale(1.04);
  }
  &:active {
    transform: scale(0.97);
  }
`;

const GridWrapper = styled.div`
  position: relative;
`;

const AvatarBubbleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
  margin-top: -82px;
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
  width: 500px;
  height: auto;
  margin-top: 0;
  margin-bottom: 0;
`;

const FloatingButton = styled.button`
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
  border: 3px solid #8b7355;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: #f5f5f5;
    transform: scale(1.08);
  }
  img {
    width: 30px;
    height: 30px;
  }
`;

function CatTownPage() {
  const navigate = useNavigate();
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
  const [gridSize] = useState({ rows: 3, cols: 3 });
  const townGridRef = useRef(null);
  const [showSaved, setShowSaved] = useState(false);
  const [confirmAnim, setConfirmAnim] = useState(false);

  // --- Add canPlaceAtCell logic here (copied from TownGrid, but using townBuildings) ---
  const canPlaceAtCell = (cellId, activeId) => {
    if (!activeId || !cellId) return null;
    const activeBuilding = townBuildings.find((b) => b.id === activeId);
    if (!activeBuilding) return null;

    const [originRow, originCol] = cellId.split("-").map(Number);
    const rows = activeBuilding.size?.rows || 1;
    const cols = activeBuilding.size?.cols || 1;

    // Check for out of bounds or overlap
    for (let dr = 0; dr < rows; dr++) {
      for (let dc = 0; dc < cols; dc++) {
        const checkRow = originRow - dr; // Changed from + to - to grow upward
        const checkCol = originCol + dc;
        if (
          checkRow < 0 ||
          checkCol < 0 ||
          checkRow >= gridSize.rows ||
          checkCol >= gridSize.cols
        ) {
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

    // Stacking rule: for each column the building would occupy, check only the bottom-most cell
    for (let dc = 0; dc < cols; dc++) {
      const bottomRow = originRow;
      const checkCol = originCol + dc;
      // If on bottom row, allow
      if (bottomRow === gridSize.rows - 1) continue;
      // Otherwise, check if there is a building directly below
      const belowRow = bottomRow + 1;
      let found = false;
      for (const b of townBuildings) {
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
      if (!found) return false;
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
        // Check if placement is valid using canPlaceAtCell
        const canPlace = canPlaceAtCell(over.id, active.id);
        if (!canPlace) return; // Don't allow drop if placement is invalid

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
                <ResetButton onClick={handleReset}>Reset</ResetButton>
                {showSaved && <SavedMessage>Saved!</SavedMessage>}
              </ButtonRow>
              <GridWrapper>
                <TownGrid
                  ref={townGridRef}
                  buildings={townBuildings}
                  gridSize={{ rows: 3, cols: 3 }}
                  cellSize={199.33}
                />
              </GridWrapper>
              <AvatarBubbleRow>
                <Avatar src={avatarFace} alt="Avatar" />
              </AvatarBubbleRow>
            </LeftPanel>
            <BuildingsPanel
              buildings={townBuildings.filter((b) => !b.position)}
              onReset={handleReset}
            />
          </MainContent>
          <FloatingButton onClick={() => navigate("/")}>
            <img src={crossImage} alt="Cross" />
          </FloatingButton>
        </PageContainer>
      </DndContext>
    </ThemeProvider>
  );
}

export default CatTownPage;
