import { insuranceType, toolbarOptions } from "@/libs/data";
import Law from "@/libs/user/law";
import { Button, Modal, Label, Select } from "flowbite-react";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";

const AddLawModal = ({ handleAddLaw }: any) => {
  const [isOpen, setOpen] = useState(false);
  const [lawInfor, setLawInfor] = useState({
    lawType: "01",
    content: "",
  });

  // const handleAddLaw = async () => {
  //   try {
  //     const res = await Law.create(
  //       lawInfor,
  //       localStorage.getItem("userAccount")
  //     );
  //   } catch (error: any) {
  //     if (error.message.includes("already exists")) {
  //       toast.error("Luật đã tồn tại, không thể thêm mới!", {
  //         autoClose: 5000,
  //       });
  //     }
  //     console.log(error);
  //   } finally {
  //     setOpen(false);
  //   }
  // };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Thêm luật
        </div>
      </Button>
      <Modal size={"3xl"} onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Thêm luật</strong>
        </Modal.Header>
        <Modal.Body className="max-h-[650px]">
          <div className="space-y-3">
            <div>
              <Label htmlFor="typeInsurance">Loại bảo hiểm</Label>
              <div className="mt-2">
                <Select
                  value={lawInfor.lawType}
                  onChange={(e) => {
                    setLawInfor({ ...lawInfor, lawType: e.target.value });
                  }}
                  id="typeInsurance"
                  required
                >
                  {insuranceType.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.title}
                    </option>
                  ))}
                </Select>{" "}
              </div>
            </div>
            <div>
              <Label htmlFor="content">Nội dung</Label>
              <ReactQuill
                theme="snow"
                modules={{ toolbar: toolbarOptions }}
                className="dark:text-white mt-2"
                value={lawInfor.content}
                onChange={(value) => {
                  setLawInfor({ ...lawInfor, content: value });
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button
            color="primary"
            onClick={() => {
              handleAddLaw(lawInfor);
              setOpen(false);
            }}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddLawModal;
