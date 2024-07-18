import React, { useState } from "react";
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
} from "../../../store/reducers/CargoReducer";
import EditCargo from "./EditCardo";
import CashOnDelivery from "./CashOnDelivery";

const AddCargo = () => {
  const dispatch = useDispatch();
  const cargoSpaces = useSelector(
    (state: RootState) => state.cargoSpace.cargoSpaces
  );

  
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
      {cargoSpaces.length > 0 ? (
        cargoSpaces.map((cargo, index) => (
          <div key={cargo.id} className="cargo-block">
            <div className="cargo-container">
              <BoxIcon className="cargo-icon box" />
              <p className="cargo-text">Грузовое место №{cargo.id}</p>
              <EditIcon
                className="cargo-action-icon edit"
                onClick={() => handleEdit(cargo.id)}
              />
              <ContentCopyIcon
                className="cargo-action-icon copy"
                onClick={() => dispatch(copyCargoSpace(cargo.id))}
              />
              <DeleteIcon
                className="cargo-action-icon delete"
                onClick={() => dispatch(removeCargoSpace(cargo.id))}
              />
            </div>



            {editId === cargo.id ? (
              <EditCargo
                id={cargo.id}
                initialWeight={cargo.weight.toString()}
                initialSize={cargo.size}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                <CashOnDelivery />

                <div>
                  <div style={{ display: "flex", gap: "75px" }}>
                    <p className="cargo-info">Вес: {cargo.weight} кг. </p>
                    <p className="cargo-info">Размер коробки: {cargo.size} </p>
                    <div
                      className="cargo-info item"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleToggleItemInfo(cargo.id)}
                    >
                      <p>Информацию о товаре</p>
                      {showItemInfoId === cargo.id ? (
                        <ExpandLessTwoToneIcon style={{ fontSize: "35px" }} />
                      ) : (
                        <ExpandMoreTwoToneIcon style={{ fontSize: "35px" }} />
                      )}
                    </div>
                  </div>
                  {showItemInfoId === cargo.id && (
                    <div className="item-info">
                      <p>Наименование товара – стеклянные флаконы</p>
                      <p>Код товара/артикул – {cargo.id}</p>
                      <p>Физический вес ед. товара – {cargo.weight} кг</p>
                      <p>Количество – 1</p>
                      <p>
                        Объявленная стоимость за ед. товара -{" "}
                        {index === 0 ? 100 : 0}
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

export default AddCargo;
