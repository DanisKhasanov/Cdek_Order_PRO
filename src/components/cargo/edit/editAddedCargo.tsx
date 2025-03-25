import { useState } from "react";
import { useDispatch } from "react-redux";
import { editCargoSpace } from "../../../store/reducers/OrderReducer"; // Импортируем редьюсер
import { EditAddedCargoProps } from "../../../props/EditAddedCargoProps";

import { useSnackbar } from "notistack";
import { getCargoSizeOptions } from "../../../helpers/cargoSize";

const EditAddedACargo = ({ id, size, onCancel }: EditAddedCargoProps) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(size);
  const { enqueueSnackbar } = useSnackbar();
  const cargoSizeOptions = getCargoSizeOptions();

  const save = () => {
    if (!selectedSize) {
      enqueueSnackbar("Выберите размер коробки", {
        anchorOrigin: { vertical: "top", horizontal: "right" },
        variant: "error",
      });
      return;
    }

    dispatch(
      editCargoSpace({
        index: id,
        size: selectedSize,
      })
    );

    onCancel();
  };

  return (
    <div className="cargo-edit">
      <select
        value={selectedSize}
        onChange={(e) => setSelectedSize(e.target.value)}
      >
        {cargoSizeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button onClick={save}>Сохранить</button>
      <button onClick={onCancel}>Отмена</button>
    </div>
  );
};

export default EditAddedACargo;
