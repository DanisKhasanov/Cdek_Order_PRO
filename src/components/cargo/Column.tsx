import { useDroppable } from "@dnd-kit/core";

export function Column({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 10,
        minWidth: 450,
        backgroundColor: "#f4f4f4",
        borderRadius: 10,
      }}
      ref={setNodeRef}
    >
      <p style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold" }}>Грузовое место {id}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
          padding: "5px",
          fontSize: "12px",
        }}
      >
        <span style={{ width: "280px" }}>Название товара</span>
        <span>Количество</span>
        <span>Вес</span>
      </div>
      {children}
    </div>
  );
}
