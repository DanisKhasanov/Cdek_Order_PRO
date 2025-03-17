import { useDroppable } from "@dnd-kit/core";

const styles = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 10,
  minWidth: 450,
  backgroundColor: "rgba(0,0,0,0.1)",
  borderRadius: 10,
};

export function Column({ children, id }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div style={styles} ref={setNodeRef}>
      <h4> Грузовое место {id}</h4>
      {children}
    </div>
  );
}
