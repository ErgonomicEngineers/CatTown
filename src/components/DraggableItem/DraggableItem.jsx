import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { ItemContainer } from "./styles";

const DraggableItem = ({ id, image, size }) => {
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
      <img
        src={image}
        alt="Building"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </ItemContainer>
  );
};

export default DraggableItem;
