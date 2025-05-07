import React, { useState } from "react";
import styled from "styled-components";
import DraggableItem from "../DraggableItem/DraggableItem";
import { useDroppable } from "@dnd-kit/core";
import arrowLeft from "../../assets/arrow_left.png";
import arrowRight from "../../assets/arrow_right.png";

const Panel = styled.div`
  background: transparent;
  padding: 0;
  border-radius: 0;
  border: none;
  width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  color: var(--miscellaneous-keyboard-emoji-mic, rgba(27, 31, 38, 0.72));
  text-align: center;
  font-family: "Inter", sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 24px 0 18px 0;
`;

const GridWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ArrowButton = styled.img`
  width: 32px;
  height: 32px;
  cursor: pointer;
  user-select: none;
  margin: 0 8px;
`;

const BuildingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 18px 18px;
  width: 500px;
  min-height: 1000px;
`;

const BuildingCard = styled.div`
  width: 229px;
  height: 229px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 1px 7px 3px var(--Color-2, #bfbfd0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

const ResetButton = styled.button`
  margin: 24px auto 0 auto;
  background: #fff;
  color: #333;
  border: 3px solid #8080804c;
  padding: 14px 36px;
  border-radius: 7px;
  font-size: 1.1rem;
  font-weight: 700;
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

const BuildingsPanel = ({ buildings }) => {
  const { setNodeRef } = useDroppable({ id: "available-buildings-panel" });
  const [page, setPage] = useState(0);
  const buildingsPerPage = 8;
  const totalPages = Math.ceil(buildings.length / buildingsPerPage);
  const pagedBuildings = buildings.slice(
    page * buildingsPerPage,
    (page + 1) * buildingsPerPage
  );

  return (
    <Panel ref={setNodeRef}>
      <Header>Drag & place your buildings into Cat Town!</Header>
      <GridWrapper>
        <ArrowButton
          src={arrowLeft}
          alt="Previous"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          style={{ opacity: page === 0 ? 0.3 : 1 }}
        />
        <BuildingsGrid>
          {pagedBuildings.map((building) => (
            <BuildingCard key={building.id}>
              <DraggableItem
                id={building.id}
                image={building.image}
                size={building.size}
              />
            </BuildingCard>
          ))}
        </BuildingsGrid>
        <ArrowButton
          src={arrowRight}
          alt="Next"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          style={{
            opacity: page === totalPages - 1 || totalPages === 0 ? 0.3 : 1,
          }}
        />
      </GridWrapper>
    </Panel>
  );
};

export default BuildingsPanel;
