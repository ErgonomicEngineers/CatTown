import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { ItemContainer } from "./styles";

const DraggableItem = ({ id, name, emoji, size }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <ItemContainer
      ref={setNodeRef}
      style={style}
      size={size}
      {...listeners}
      {...attributes}
    >
      <span className="emoji">{emoji}</span>
      <span className="name">{name}</span>
    </ItemContainer>
  );
};

export default DraggableItem;
