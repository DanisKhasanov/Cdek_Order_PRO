import { Formik, Form, Field } from "formik";
import { initialValues, validationSchema } from "./Validation";
import ButtonCustom from "./ButtonCustom";
import { CargoSizeOptions } from "../../enum/CargoSize";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCargoSpace } from "../../store/reducers/OrderReducer";
import { useSnackbar } from "notistack";

const FormInputsCargo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const packages = useSelector((state: RootState) => state.orderForm.packages);
  const orderData = useSelector((state: RootState) => state.orderForm);
  const { name_product, declared_cost } = JSON.parse(
    localStorage.getItem("settingAccount") || "{}"
  );
  const emptyNames = packages.some((pkg) => !pkg.items[0].name.trim());

  const addCargo = (values: any) => {
    dispatch(
      addCargoSpace({
        weight: values.weight,
        size: values.size,
        items: {
          name: name_product,
          ware_key: "1",
          weight: values.weight,
          marking: (packages.length + 1).toString(),
          amount: 1,
          payment: {
            value: orderData.cod === false ? 0 : orderData.sum,
          },
          cost: declared_cost,
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
              marginTop: 5,
              justifyContent: "space-between",
            }}
          >
            <div className="form-group cargo">
              <label htmlFor="weight">* Вес (кг):</label>
              <Field
                type="number"
                id="weight"
                name="weight"
                className={`form-control ${
                  errors.weight && touched.weight ? "error" : ""
                }`}
                placeholder={
                  touched.weight && errors.weight ? errors.weight : ""
                }
              />
            </div>

            <div className="form-group cargo">
              <label htmlFor="size">Размеры коробки:</label>
              <Field
                as="select"
                id="size"
                name="size"
                className={`form-control ${
                  errors.size && touched.size ? "error" : ""
                }`}
              >
                {CargoSizeOptions.map((option) => (
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
