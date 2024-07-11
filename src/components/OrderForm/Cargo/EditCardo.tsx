import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editCargoSpace } from "../../../store/reducers/CargoReducer";

interface CargoEditProps {
  id: number;
  initialWeight: string;
  initialSize: string;
  onCancel: () => void;
}

const CargoEdit = ({
  id,
  initialWeight,
  initialSize,
  onCancel,
}: CargoEditProps) => {

  const dispatch = useDispatch();
  
  const [editValues, setEditValues] = useState({
    weight: initialWeight,
    size: initialSize,
  });

  const handleSave = () => {
    dispatch(
      editCargoSpace({
        id,
        weight: parseFloat(editValues.weight),
        size: editValues.size,
      })
    );
    onCancel();
  };

  return (
    <div className="cargo-edit">
      <input
        type="number"
        value={editValues.weight}
        onChange={(e) =>
          setEditValues({ ...editValues, weight: e.target.value })
        }
      />
      <select
        value={editValues.size}
        onChange={(e) => setEditValues({ ...editValues, size: e.target.value })}
      >
        <option value="20x20x10">до 2 кг 20х20х10</option>
        <option value="30x30x15">от 2-5 кг 30х30х15</option>
        <option value="30x30x17">от 5-10 кг 30х30х17</option>
        <option value="45x30x30">7 и более 45х30х30</option>
      </select>
      <button onClick={handleSave}>Сохранить</button>
      <button onClick={onCancel}>Отмена</button>
    </div>
  );
};

export default CargoEdit;
