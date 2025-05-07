import React, { useState, useRef } from "react";
import styled, { ThemeProvider } from "styled-components";
import GlobalStyles from "../styles/GlobalStyles";
import TownGrid from "../components/TownGrid/TownGrid";
import { buildings } from "../data/buildings";
import avatarFace from "../assets/avatar-face.gif";
import convoBubble from "../assets/convo_bubble.png";
import { useNavigate } from "react-router-dom";
import toolImage from "../assets/tool.png";
import backImage from "../assets/back.png";

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
  position: relative;
`;

const Avatar = styled.img`
  width: 700px;
  height: 700px;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  margin-top: -550px;
`;

const ConversationBubble = styled.img`
  position: absolute;
  right: -20px;
  top: 200px;
  width: 363px;
  height: auto;
  z-index: 1000;
`;

const FloatingButton = styled.button`
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 82px;
  height: 82px;
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
    width: 45px;
    height: 30px;
  }
`;

// Hide grid lines by passing a prop to TownGrid and using a custom style
const NoLineGridWrapper = styled.div`
  margin-left: 290px;
  margin-top: 100px;
  & > div {
    border: none !important;
    background: transparent !important;
  }
  .GridCell__cell {
    border: none !important;
    background: transparent !important;
  }
`;

const BackButton = styled.button`
  position: fixed;
  left: 35px;
  top: 28px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 100;
  img {
    width: 30px;
    height: 30px;
  }
`;

const PreviewGridWrapper = styled.div`
  width: 438px;
  height: 438px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
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
              cellSize={146}
            />
          </NoLineGridWrapper>
          <Avatar src={avatarFace} alt="Avatar" />
          <ConversationBubble src={convoBubble} alt="Conversation bubble" />
        </GridAvatarWrapper>
        <FloatingButton onClick={() => navigate("/cattown")}>
          <img src={toolImage} alt="Tool" />
        </FloatingButton>
        <BackButton onClick={() => navigate("/")}>
          <img src={backImage} alt="Back" />
        </BackButton>
      </CenteredContainer>
    </ThemeProvider>
  );
}

export default CenteredPreviewPage;
