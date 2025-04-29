import { useDrag } from "react-dnd";

export default function House({ id, image }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: "HOUSE",
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <img
      ref={dragRef}
      src={image}
      alt="house"
      style={{
        width: "80px",
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    />
  );
}