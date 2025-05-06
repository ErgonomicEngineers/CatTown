import styled from "styled-components";

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #6b563f;
  border-radius: 8px;
  cursor: grab;
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 2000;

  width: ${({ size }) => (size?.cols === 2 ? "210px" : "100px")};
  height: ${({ size }) => (size?.rows === 2 ? "210px" : "100px")};

  &[data-dragging="true"] {
    z-index: 2000;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  .emoji {
    font-size: 2rem;
    margin-bottom: 5px;
  }

  .name {
    font-size: 0.8rem;
    text-align: center;
    color: #4a3c28;
  }
`;
