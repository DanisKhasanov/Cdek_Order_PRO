import { useDraggable } from "@dnd-kit/core";

export function Item({
  name,
  amount,
  weight,
  id,
}: {
  name: string;
  amount: number;
  weight: number;
  id: string;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    padding: "10px",
    backgroundColor: "white",
    border: "1px solid silver",
    cursor: "grab",
    borderRadius: "8px",
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : "none",
    fontSize: "11px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <span style={{ width: "300px" }}>{name}</span>
      <span>{amount}</span>
      <span>{(weight * amount).toFixed(3)} кг</span>
    </div>
  );
}
