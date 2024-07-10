import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import BoxIcon from "@mui/icons-material/Inventory";

const AddCargo = () => {
  return (
    <div className="add-cargo">
      <div className="cargo-block">
        <div className="cargo-container">
          <BoxIcon className="cargo-icon box" />
          <p className="cargo-text">Грузовое место №1</p>
          <EditIcon className="cargo-action-icon edit" />
          <ContentCopyIcon className="cargo-action-icon copy" />
          <DeleteIcon className="cargo-action-icon delete" />
        </div>
        <div style={{ display: "flex" }}>
          <p className="cargo-info">Вес: 5 кг. </p>
          <p className="cargo-info">Размер коробки: 20х20х10 </p>
        </div>
      </div>

      <div className="cargo-block">
        <div className="cargo-container">
          <BoxIcon className="cargo-icon box" />
          <p className="cargo-text">Грузовое место №2</p>
          <EditIcon className="cargo-action-icon edit" />
          <ContentCopyIcon className="cargo-action-icon copy" />
          <DeleteIcon className="cargo-action-icon delete" />
        </div>
        <div style={{ display: "flex" }}>
          <p className="cargo-info">Вес: 5 кг. </p>
          <p className="cargo-info">Размер коробки: 20х20х10 </p>
        </div>
      </div>
    </div>
  );
};

export default AddCargo;
