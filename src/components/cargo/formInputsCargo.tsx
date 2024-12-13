import { Formik, Form, Field } from "formik";
import { initialValues, validationSchema } from "./Validation";
import ButtonCustom from "./ButtonCustom";
// import { CargoSizeOptions } from "../../enum/CargoSize";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCargoSpace } from "../../store/reducers/OrderReducer";
import { useSnackbar } from "notistack";
import { getCargoSizeOptions } from "./cargoSize";

const FormInputsCargo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const cargoSizeOptions = getCargoSizeOptions();
  const packages =
    useSelector((state: RootState) => state.orderForm.packages) || [];
  const orderData = useSelector((state: RootState) => state.orderForm);
  const settingAccount = JSON.parse(
    localStorage.getItem("settingAccount") || "{}"
  );
  const defaultProductName = settingAccount?.defaultProductName || "";
  const defaultDeclaredCost = settingAccount?.defaultDeclaredCost || 0;

  const emptyNames =
    packages.length > 0 &&
    packages.some((pkg) => {
      if (!pkg?.items?.[0]?.name) return true;
      return pkg.items[0].name.trim() === "";
    });

  const addCargo = (values: any) => {
    dispatch(
      addCargoSpace({
        weight: values.weight,
        size: values.size,
        items: {
          name: defaultProductName,
          wareKey: "1",
          weight: values.weight,
          marking: (packages.length + 1).toString(),
          amount: 1,
          payment: {
            value: orderData.cod === false ? 0 : orderData.sum,
          },
          cost: defaultDeclaredCost,
        },
      })
    );
  };

  const nextPage = () => {
    if (emptyNames) {
      enqueueSnackbar("Заполните наименование товара", {
        anchorOrigin: { vertical: "top", horizontal: "right" },
        variant: "error",
      });
    } else {
      navigate("/tariffs");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={addCargo}
    >
      {({ errors, touched }) => (
        <Form>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 16,
            }}
          >
            <div className="form-group cargo">
              {errors.weight && touched.weight && (
                <div className="error-message-top">{errors.weight}</div>
              )}
              <label htmlFor="weight">Вес (кг):</label>
              <Field
                type="number"
                min={0}
                step={0.01}
                id="weight"
                name="weight"
                className={`form-control ${
                  errors.weight && touched.weight ? "error" : ""
                }`}
                placeholder="Введите вес"
              />
            </div>

            <div className="form-group cargo">
              {errors.size && touched.size && (
                <div className="error-message-top">{errors.size}</div>
              )}
              <label htmlFor="size">Размеры коробки:</label>
              <Field
                as="select"
                id="size"
                name="size"
                className={`form-control ${
                  errors.size && touched.size ? "error" : ""
                }`}
                
              >
                {cargoSizeOptions.map((option: any) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Field>
            </div>
          </div>

          <div className="buttons">
            <ButtonCustom type="submit" className="btn">
              Добавить
            </ButtonCustom>
            <ButtonCustom
              type="button"
              className="next"
              onClick={nextPage}
              disabled={packages.length === 0}
            >
              Далее
            </ButtonCustom>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormInputsCargo;
