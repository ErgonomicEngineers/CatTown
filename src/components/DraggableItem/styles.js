import styled from "styled-components";

export const ItemContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  background: none;
  border: none;
  border-radius: 0;
  cursor: grab;
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 2000;

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
