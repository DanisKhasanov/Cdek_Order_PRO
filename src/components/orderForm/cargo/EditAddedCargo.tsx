import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editCargoSpace } from "../../../store/reducers/OrderReducer";
import { EditAddedCargoProps } from "../../../props/EditAddedCargoProps";
import { CargoSizeOptions } from "../../../enum/CargoSize";
import { RootState } from "../../../store/store";

const EditAddedACargo = ({
  id,
  weight,
  size,
  onCancel,
}: EditAddedCargoProps) => {
  const orderData = useSelector((state: RootState) => state.orderForm);
  const dispatch = useDispatch();
  const [editValues, setEditValues] = useState({
    weight: weight,
    size: size,
  });

  const handleSave = () => {
    const totalPackages = orderData.packages.length;
    const costPerPackage = 100 / totalPackages; 

    dispatch(
      editCargoSpace({
        index: id,
        weight: editValues.weight,
        size: editValues.size,
        items: {
          name: "Стеклянные флаконы",
          ware_key: (id + 1).toString(),
          weight: editValues.weight,
          amount: 1,
          payment: {
            value: orderData.cod === false ? 0 : orderData.sum,
          },
          cost: costPerPackage,
        },
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
        {CargoSizeOptions.map((option) => (
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
