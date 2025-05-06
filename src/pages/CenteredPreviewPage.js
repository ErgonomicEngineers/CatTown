import React, { useState, useRef } from "react";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyles from "../styles/GlobalStyles";
import TownGrid from "../components/TownGrid/TownGrid";
import { buildings } from "../data/buildings";
import avatarFace from "../assets/avatar-face.png";
import { useNavigate } from "react-router-dom";

const theme = {
  colors: {
    primary: "#4a3c28",
    secondary: "#6b563f",
    background: "#f8f8f8",
    accent: "#8b7355",
  },
};

const CenteredContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${(props) => props.theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const GridAvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
`;

const Avatar = styled.img`
  width: 220px;
  height: auto;
  margin-top: 24px;
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
  font-size: 2.5rem;
  color: #8b7355;
  cursor: pointer;
  z-index: 100;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: #f5f5f5;
    transform: scale(1.08);
  }
`;

// Hide grid lines by passing a prop to TownGrid and using a custom style
const NoLineGridWrapper = styled.div`
  & > div {
    border: none !important;
    background: transparent !important;
  }
  .GridCell__cell {
    border: none !important;
    background: transparent !important;
  }
`;

function CenteredPreviewPage() {
  const [townBuildings, setTownBuildings] = useState(() => {
    const saved = localStorage.getItem("catTownBuildings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return buildings;
      }
    }
    return buildings;
  });
  const [gridSize] = useState({ rows: 5, cols: 5 });
  const gridRef = useRef(null);
  const navigate = useNavigate();

  // Only show buildings that are placed
  const placedBuildings = townBuildings.filter((b) => b.position);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CenteredContainer>
        <GridAvatarWrapper>
          <NoLineGridWrapper>
            <TownGrid
              ref={gridRef}
              buildings={placedBuildings}
              gridSize={gridSize}
              hideGridLines // This prop can be used in TownGrid to hide lines if needed
            />
          </NoLineGridWrapper>
          <Avatar src={avatarFace} alt="Avatar" />
        </GridAvatarWrapper>
        <FloatingButton onClick={() => navigate("/cattown")}>🔧</FloatingButton>
      </CenteredContainer>
    </ThemeProvider>
  );
}

export default CenteredPreviewPage;
