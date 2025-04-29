import { useDrop } from "react-dnd";

export default function GridCell({ x, y, onDrop, children }) {
  const [, dropRef] = useDrop({
    accept: "HOUSE",
    drop: (item) => onDrop(item.id, x, y),
  });

  return (
    <div ref={dropRef} className="grid-cell">
    {children}
  </div>
  );
}