import React, { useState, useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyles from "../styles/GlobalStyles";
import TownGrid from "../components/TownGrid/TownGrid";
import BuildingsPanel from "../components/BuildingsPanel/BuildingsPanel";
import { buildings } from "../data/buildings";
import Cat from "../components/Cat/Cat";

const theme = {
  colors: {
    primary: "#4a3c28",
    secondary: "#6b563f",
    background: "#87CEEB", // Sky blue for town background
    accent: "#8b7355",
  },
};

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 20px;
  background: ${(props) => props.theme.colors.background};
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
`;

function CatTownPage() {
  const [townBuildings, setTownBuildings] = useState(buildings);
  const [gridSize] = useState({ rows: 5, cols: 5 });
  const townGridRef = useRef(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      setTownBuildings(
        townBuildings.map((building) =>
          building.id === active.id
            ? { ...building, position: over.id }
            : building
        )
      );
    }
  };

  const handleReset = () => {
    setTownBuildings(
      buildings.map((building) => ({ ...building, position: null }))
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <DndContext onDragEnd={handleDragEnd}>
        <PageContainer>
          <MainTitle>Cat Town</MainTitle>
          <BuildingsPanel
            buildings={townBuildings.filter((b) => !b.position)}
            onReset={handleReset}
          />
          <TownGrid
            ref={townGridRef}
            buildings={townBuildings.filter((b) => b.position)}
            gridSize={gridSize}
          />
          <Cat gridRef={townGridRef} />
        </PageContainer>
      </DndContext>
    </ThemeProvider>
  );
}

export default CatTownPage;
