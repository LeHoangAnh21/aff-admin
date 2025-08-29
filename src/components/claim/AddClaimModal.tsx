import { insuranceType, toolbarOptions } from "@/libs/data";
import Law from "@/libs/user/law";
import { Button, Modal, Label, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import { HiPlus, HiTrash } from "react-icons/hi";
import ReactQuill from "react-quill";
import { toast } from "react-toastify";

const AddClaimModal = ({ handleAdd }: any) => {
  const [isOpen, setOpen] = useState(false);
  const [infor, setInfor] = useState({
    guideType: "01",
    content: [],
  });
  const [content, setContent] = useState("");

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Thêm
        </div>
      </Button>
      <Modal size={"3xl"} onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Thêm thông tin bồi thường</strong>
        </Modal.Header>
        <Modal.Body className="max-h-[650px]">
          <div className="space-y-4">
            <div>
              <Label htmlFor="typeInsurance">Loại bảo hiểm</Label>
              <div className="mt-2">
                <Select
                  value={infor.guideType}
                  onChange={(e) => {
                    setInfor({ ...infor, guideType: e.target.value });
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
              <Label htmlFor="guide">Nội dung hướng dẫn bồi thường</Label>
              <div className="mt-2 flex gap-2">
                <TextInput
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  id="guide"
                  className="w-full"
                />
                <Button
                  onClick={() => {
                    setContent("");
                    setInfor((pre: any) => ({
                      ...pre,
                      content: [...pre.content, content],
                    }));
                  }}
                >
                  Thêm
                </Button>
              </div>
            </div>
            <div className="space-y-5 border-[1px] rounded-lg p-4 border-white text-base font-medium text-gray-900 dark:text-white">
              {infor.content.length === 0 ? (
                <div className="text-center p-5">
                  <h1>Chưa có nội dung bồi thường</h1>
                </div>
              ) : (
                infor.content.map((item: any, index: number) => (
                  <div className="space-y-2">
                    <p key={index}>Điều {index + 1}:</p>
                    <div className="flex justify-between gap-2">
                      <TextInput
                        value={item}
                        onChange={(e: any) => {
                          let data: any = infor.content;
                          data[index] = e.target.value;
                          setInfor((pre) => ({ ...pre, content: data }));
                        }}
                        id="guide"
                        className="w-full"
                      />
                      <Button
                        color="failure"
                        onClick={() => {
                          let data: any = infor.content;
                          data.splice(index, 1);
                          setInfor((pre) => ({ ...pre, content: data }));
                        }}
                      >
                        <HiTrash className="mr-2 text-lg" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button
            color="primary"
            onClick={() => {
              handleAdd(infor);
              setInfor({
                guideType: "01",
                content: [],
              });
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
export default AddClaimModal;
