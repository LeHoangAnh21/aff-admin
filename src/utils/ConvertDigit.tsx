const ConvertDigit = (value: number | undefined) => {
  if (typeof value === "number" || typeof value === "string") {
    return value.toLocaleString("vi-VN");
  } else {
    return 0;
  }
};

export default ConvertDigit;
