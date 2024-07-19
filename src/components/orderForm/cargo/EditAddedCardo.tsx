import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editCargoSpace } from "../../../store/reducers/CargoReducer";
import { EditAddedCargoProps } from '../../../props/EditAddedCargoProps'
import { CargoSizeOptions } from "../../../enum/CargoSize";


const EditAddedACargo = ({
  id,
  Weight,
  Size,
  onCancel,
}: EditAddedCargoProps) => {

  const dispatch = useDispatch();
  const [editValues, setEditValues] = useState({
    weight: Weight,
    size: Size,
  });

  const handleSave = () => {
    dispatch(
      editCargoSpace({
        id,
        weight:editValues.weight,
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
          setEditValues({ ...editValues, weight: Number(e.target.value) })
        }
      />
      <select
        value={editValues.size}
        onChange={(e) => setEditValues({ ...editValues, size: e.target.value })}
      >
           {CargoSizeOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button onClick={handleSave}>Сохранить</button>
      <button onClick={onCancel}>Отмена</button>
    </div>
  );
};

export default EditAddedACargo;
