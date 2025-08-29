import {
  Button,
  Modal,
  Label,
  TextInput,
  Select as SelectInput,
  Checkbox,
  Textarea,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { HiTrash, HiUpload } from "react-icons/hi";
import { Variant } from "@/types/Variant.dto";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Product from "@/libs/product/product";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],

  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],

  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],

  ["clean"],
];

export const EditProductModal = ({ handleUpdate, data }) => {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [price, setPrice] = useState<any>(data.price);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Cập nhật
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size={"sm"}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Cập nhật sản phẩm</strong>
        </Modal.Header>
        <Modal.Body className="max-h-[650px]">
          <div>
            <Label htmlFor="productName" className="text-base font-semibold">
              Giá bảo hiểm
            </Label>
            <TextInput
              id="title"
              name="title"
              type="text"
              className="mt-3"
              value={price}
              onChange={(e) => {
                if (!/^\d*$/.test(e.target.value)) {
                  return;
                }
                setPrice(e.target.value);
              }}
              required
            />
            {/* {errors.title && (
                  <Label className="dark:text-[#ff0000] text-[#ff0000]">
                    {errors.title}
                  </Label>
                )} */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            onClick={() =>
              handleUpdate({ id: data.id, price: parseInt(price) })
            }
            disabled={isLoading}
            className={"ml-auto"}
          >
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
