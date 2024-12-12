export const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const dateFormatted = date.toLocaleDateString("ru-RU");
    const timeFormatted = date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateFormatted} в ${timeFormatted}`;
  };
