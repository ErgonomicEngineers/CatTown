import React from "react";
import styled from "styled-components";
import DraggableItem from "../DraggableItem/DraggableItem";

const Panel = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 4px solid #458445;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: #458445;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;

  &::before {
    content: "🏠";
  }
`;

const ResetButton = styled.button`
  background: #458445;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: #346434;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const BuildingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  padding: 10px;
`;

const BuildingsPanel = ({ buildings, onReset }) => {
  return (
    <Panel>
      <Header>
        <Title>Available Buildings</Title>
        <ResetButton onClick={onReset}>Reset Town 🔄</ResetButton>
      </Header>
      <BuildingsGrid>
        {buildings.map((building) => (
          <DraggableItem
            key={building.id}
            id={building.id}
            name={building.name}
            emoji={building.emoji}
          />
        ))}
      </BuildingsGrid>
    </Panel>
  );
};

export default BuildingsPanel;
