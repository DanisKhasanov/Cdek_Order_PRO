import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/EditOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/DeleteForeverOutlined";
import BoxIcon from "@mui/icons-material/ArchiveTwoTone";
import ExpandLessTwoToneIcon from "@mui/icons-material/ExpandLessTwoTone";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import { RootState } from "../../../store/store";
import {
  removeCargoSpace,
  copyCargoSpace,
  editCargoSpace,
} from "../../../store/reducers/OrderReducer";
import EditAddedACargo from "./EditAddedCargo";
import CashOnDelivery from "./CashOnDelivery";

const AddedCargo = () => {
  const dispatch = useDispatch();
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const [editId, setEditId] = useState<number | null>(null);
  const [showItemInfoId, setShowItemInfoId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    setEditId(id);
  };

  const handleCancelEdit = () => {
    setEditId(null);
  };

  const handleToggleItemInfo = (id: number) => {
    setShowItemInfoId(showItemInfoId === id ? null : id);
  };


  return (
    <div className="add-cargo">
      {packages.length > 0 ? (
        packages.map((cargo, index) => (
          <div key={index} className="cargo-block">
            <div className="cargo-container">
              <BoxIcon className="cargo-icon box" />
              <p className="cargo-text">Грузовое место №{index + 1}</p>
              <EditIcon
                className="cargo-action-icon edit"
                onClick={() => handleEdit(index)}
              />
              <ContentCopyIcon
                className="cargo-action-icon copy"
                onClick={() => dispatch(copyCargoSpace(index))}
              />
              <DeleteIcon
                className="cargo-action-icon delete"
                onClick={() => dispatch(removeCargoSpace(index))}
              />
            </div>

            {editId === index ? (
              <EditAddedACargo id={index} weight={cargo.weight} size={`${cargo.length}x${cargo.width}x${cargo.height}`} onCancel={handleCancelEdit} />
            ) : (
              <>
                <CashOnDelivery />

                <div>
                  <div style={{ display: "flex", gap: "75px" }}>
                    <p className="cargo-info">Вес: {cargo.weight} кг. </p>
                    <p className="cargo-info">Размер коробки: {cargo.length}x{cargo.width}x{cargo.height} </p>
                    <div
                      className="cargo-info item"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        handleToggleItemInfo(index);
                      }}
                    >
                      <p>Информация о товаре</p>
                      {showItemInfoId === index ? (
                        <ExpandLessTwoToneIcon style={{ fontSize: "35px" }} />
                      ) : (
                        <ExpandMoreTwoToneIcon style={{ fontSize: "35px" }} />
                      )}
                    </div>
                  </div>

                  {showItemInfoId === index && (
                    <div className="item-info">
                      <p>Наименование товара – стеклянные флаконы</p>
                      <p>Код товара/артикул – {index + 1}</p>
                      <p>Физический вес ед. товара – {cargo.weight} кг</p>
                      <p>Количество – 1</p>
                      <p>
                        Объявленная стоимость за ед. товара -{" "}
                        {(100 / packages.length).toFixed(2)} руб.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", fontSize: "20px" }}>
          Добавьте грузовое место
        </p>
      )}
    </div>
  );
};

export default AddedCargo;
