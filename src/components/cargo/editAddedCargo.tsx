import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editCargoSpace } from "../../store/reducers/OrderReducer";
import { EditAddedCargoProps } from "../../props/EditAddedCargoProps";
import { RootState } from "../../store/store";
import { validateWeightAndSize } from "./Validation";
import { getCargoSizeOptions } from "../../enum/CargoSize";

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
  const [error, setError] = useState<string | null>(null);
  const { name_product, declared_cost } = JSON.parse(
    localStorage.getItem("settingAccount") || "{}"
  );
  const cargoSizeOptions = getCargoSizeOptions();
  const save = () => {
    const { weight, size } = editValues;

    const isValid = validateWeightAndSize(weight, size);
    if (!isValid) {
      setError("Введите число (кг) согласно размеру коробки");
      return;
    }

    const totalPackages = orderData.packages.length;
    const costPerPackage =
      totalPackages > 0 ? declared_cost / totalPackages : 0;

    dispatch(
      editCargoSpace({
        index: id,
        weight: weight,
        size: size,
        items: {
          name: name_product,
          ware_key: "1",
          marking: (id + 1).toString(),
          weight: weight,
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
    <>
      <div className="cargo-edit">
          <input
          type="number"
          min={0}
          step={0.01}
          value={editValues.weight}
          onChange={(e) =>
            setEditValues({ ...editValues, weight: parseFloat(e.target.value) })
          }
        />
        <select
          value={editValues.size}
          onChange={(e) =>
            setEditValues({ ...editValues, size: e.target.value })
          }
        >
          {cargoSizeOptions.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button onClick={save}>Сохранить</button>
        <button onClick={onCancel}>Отмена</button>
      </div>
      {error && (
        <p style={{ color: "red", marginBottom: 0, fontSize: 13 }}>{error}</p>
      )}
    </>
  );
};

export default EditAddedACargo;
