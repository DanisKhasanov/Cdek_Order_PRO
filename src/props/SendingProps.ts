export interface SendingProps {
    orderNumber: string;
    setOrderNumber: (value: string) => void;
    loading: boolean;
    error: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  }
  