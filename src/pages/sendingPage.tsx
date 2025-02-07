import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetOrderData } from "../api/api";
import { Sending } from "../components/sending/sending";
import { useDispatch } from "react-redux";
import { updateOrderForm } from "../store/reducers/OrderReducer";

export const SendingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await GetOrderData(orderNumber);
      if (response.number) {
        dispatch(
          updateOrderForm({
            number: response.number,
            recipient: {
              name: response.recipient.name,
              phones: [{ number: response.recipient.phones[0].number }],
            },
            comment: response.comment,
            cod: response.cod,
            sum: response.sum,
            positions: response.positions,
            weight: response.weight,
            counterParty: true,
          })
        );
        navigate(`/order`);
      } 
    } catch (error: any) {
      if (error.response?.data) {
        setError(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sending
      orderNumber={orderNumber}
      setOrderNumber={setOrderNumber}
      loading={loading}
      error={error}
      onSubmit={handleSubmit}
    />
  );
};
