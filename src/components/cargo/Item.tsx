import { useDraggable } from "@dnd-kit/core";

export function Item({ name, amount }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: name,
  });

  const style = {
    padding: 5,
    backgroundColor: "white",
    border: "1px solid silver",
    cursor: "grab",
    borderRadius: "5px",
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : "none",
    fontSize: "12px",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {name}, {amount} шт.
    </div>
  );
}
