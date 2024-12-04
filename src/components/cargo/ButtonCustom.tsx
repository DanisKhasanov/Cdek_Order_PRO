import { ButtonProps } from "../../props/ButtonProps";

const ButtonCustom = ({
  type = "button",
  onClick,
  className,
  children,
  disabled,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} ${disabled ? "button-disabled" : ""}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonCustom;
