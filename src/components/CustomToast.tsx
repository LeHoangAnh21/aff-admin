export default function CustomToast({
  title,
  confirm,
  closeToast,
  setIsDisable,
}: any) {
  const handleConfirm = () => {
    confirm();
    closeToast(); // Đóng toast sau khi xác nhận
    setIsDisable(false);
  };

  const handleCancel = () => {
    closeToast(); // Đóng toast sau khi từ chối
    setIsDisable(false);
  };

  return (
    <div className="p-[10px] text-center">
      <p>{title}</p>
      <div className="flex gap-3 justify-center mt-3">
        <button
          onClick={handleConfirm}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "5px 10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Xác nhận
        </button>
        <button
          onClick={handleCancel}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            padding: "5px 10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
