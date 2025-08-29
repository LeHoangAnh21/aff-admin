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
// import { productData as productDataStore } from "@/stores/products/product";
import { toolbarOptions } from "@/libs/data";

export const AddProductModal = ({ getList }) => {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [product, setProduct] = useState<any>({
    title: "",
    description: "",
    instruction: "",
    insuranceType: "",
    variants: [],
  });

  const [errors, setErrors] = useState({
    title: "",
    variants: "",
  });

  const handleAddProduct = async () => {
    console.log(product);

    try {
      setIsLoading(true);

      await Product.create(product, localStorage.getItem("userAccount"));
      getList();
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const [newVariantName, setNewVariantName] = useState("");

  // Thêm biến thể mới
  const addVariant = () => {
    if (!newVariantName.trim()) {
      setErrors({ ...errors, variants: "Tên biến thể là bắt buộc" });
      return;
    }
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        { parentVariant: newVariantName, childVariants: [] },
      ],
    });
    setNewVariantName(""); // Reset ô input
    setErrors({ ...errors, variants: "" }); // Xóa lỗi
  };

  // Xóa biến thể
  const removeVariant = (index) => {
    const newVariants = product.variants.filter((_, i) => i !== index);
    setProduct({ ...product, variants: newVariants });
  };

  // Xóa tất cả biến thể
  const removeAllVariants = () => {
    setProduct({ ...product, variants: [] });
  };

  // Thêm biến thể con
  const addSubVariant = (variantIndex) => {
    const newVariants = [...product.variants];
    newVariants[variantIndex].childVariants.push({
      title: "",
      price: 0,
      description: "",
      // instruction: "",
    });
    setProduct({ ...product, variants: newVariants });
  };

  // Xóa biến thể con
  const removeSubVariant = (variantIndex, subIndex) => {
    const newVariants = [...product.variants];
    newVariants[variantIndex].childVariants = newVariants[
      variantIndex
    ].childVariants.filter((_, i) => i !== subIndex);
    setProduct({ ...product, variants: newVariants });
  };

  // Xử lý thay đổi thông tin biến thể
  const handleVariantChange = (e, variantIndex) => {
    const { value } = e.target;
    const newVariants = [...product.variants];
    newVariants[variantIndex].parentVariant = value;
    setProduct({ ...product, variants: newVariants });
  };

  // Xử lý thay đổi thông tin biến thể con
  const handleSubVariantChange = (e, variantIndex, subIndex, field) => {
    const { value } = e.target;
    const newVariants = [...product.variants];
    if (field === "price") {
      newVariants[variantIndex].childVariants[subIndex][field] =
        parseInt(value);
    } else {
      newVariants[variantIndex].childVariants[subIndex][field] = value;
    }
    setProduct({ ...product, variants: newVariants });
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Thêm sản phẩm
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size={"4xl"}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Thêm sản phẩm</strong>
        </Modal.Header>
        <Modal.Body className="max-h-[650px]">
          <form>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="productName"
                  className="text-base font-semibold"
                >
                  Tên sản phẩm
                </Label>
                <TextInput
                  id="title"
                  name="title"
                  type="text"
                  className="mt-1"
                  value={product.title}
                  onChange={(e) => {
                    setProduct({ ...product, title: e.target.value });
                  }}
                  required
                />
                {/* {errors.title && (
                  <Label className="dark:text-[#ff0000] text-[#ff0000]">
                    {errors.title}
                  </Label>
                )} */}
              </div>

              <div>
                <Label
                  htmlFor="productName"
                  className="text-base font-semibold"
                >
                  Loại bảo hiểm
                </Label>
                <SelectInput
                  id="insuranceType"
                  value={product.insuranceType}
                  className="mt-1"
                  onChange={(e) => {
                    setProduct({ ...product, insuranceType: e.target.value });
                  }}
                  required
                >
                  <option value="" disabled hidden>
                    -Chọn loại bảo hiểm-
                  </option>
                  <option value={"01"}>Bảo hiểm ô tô</option>
                  <option value={"02"}>Bảo hiểm xe máy</option>
                </SelectInput>
                {/* {errors.title && (
                  <Label className="dark:text-[#ff0000] text-[#ff0000]">
                    {errors.title}
                  </Label>
                )} */}
              </div>
              <div className="col-span-2">
                <Label
                  htmlFor="instruction"
                  className="text-base font-semibold"
                >
                  Hướng dẫn
                </Label>
                <Textarea
                  className="mt-1"
                  value={product.instruction}
                  onChange={(e) => {
                    setProduct({ ...product, instruction: e.target.value });
                  }}
                  required
                />
                {/* {errors.title && (
                  <Label className="dark:text-[#ff0000] text-[#ff0000]">
                    {errors.title}
                  </Label>
                )} */}
              </div>
              <div className="col-span-2">
                <Label
                  htmlFor="description"
                  className="text-base font-semibold"
                >
                  Mô tả
                </Label>
                <ReactQuill
                  theme="snow"
                  modules={{ toolbar: toolbarOptions }}
                  className="dark:text-white mt-2"
                  value={product.description}
                  onChange={(value) => {
                    setProduct((pre) => ({ ...pre, description: value }));
                  }}
                />
              </div>
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <Label className="text-base font-semibold">Biến thể</Label>
                  {/* {product.variants.length > 0 && (
                    <button
                      type="button"
                      onClick={removeAllVariants}
                      className="text-red-500 hover:text-red-700 flex items-center"
                    >
                      <i className="fas fa-trash-alt mr-1"></i> Xóa tất cả
                    </button>
                  )} */}
                </div>
                <div className="mb-6">
                  <Label className="block mb-3">Tên biến thể mới</Label>
                  <div className="flex space-x-4">
                    <TextInput
                      value={newVariantName}
                      type="text"
                      onChange={(e) => setNewVariantName(e.target.value)}
                      className="w-full"
                    />
                    <Button color="primary" onClick={addVariant}>
                      <FaPlus className="mr-3 text-sm" />
                      Thêm
                    </Button>
                  </div>
                  {errors.variants && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.variants}
                    </p>
                  )}
                </div>

                {product.variants.map((variant, variantIndex) => (
                  <div
                    key={variantIndex}
                    className={`p-4 mb-6 bg-white rounded-lg border-[1px] border-gray-200 shadow-md dark:text-white dark:bg-gray-800 dark:border-gray-600 ${
                      variantIndex % 2 === 0 ? "bg-gray-50" : "bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-base">
                        Biến thể {variantIndex + 1}: {variant.parentVariant}
                      </Label>
                      <button
                        type="button"
                        onClick={() => removeVariant(variantIndex)}
                        className="text-red-500 hover:text-red-700 flex items-center"
                      >
                        <i className="fas fa-trash-alt mr-1"></i> Xóa
                      </button>
                    </div>
                    <div className="mb-4">
                      <Label>Tên biến thể</Label>
                      <TextInput
                        type="text"
                        value={variant.parentVariant}
                        onChange={(e) => handleVariantChange(e, variantIndex)}
                        className="w-full mt-2"
                      />
                      {errors[`variant_${variantIndex}`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`variant_${variantIndex}`]}
                        </p>
                      )}
                    </div>
                    <Label className="text-base">Biến thể con</Label>
                    {variant.childVariants.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                Tên
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                Giá (VNĐ)
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                Mô tả
                              </th>
                              {/* <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                Hướng dẫn
                              </th> */}
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                                Hành động
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {variant.childVariants.map(
                              (subVariant, subIndex) => (
                                <tr key={subIndex} className="border-b">
                                  <td className="px-4 py-2">
                                    <TextInput
                                      type="text"
                                      value={subVariant.title}
                                      onChange={(e) =>
                                        handleSubVariantChange(
                                          e,
                                          variantIndex,
                                          subIndex,
                                          "title"
                                        )
                                      }
                                      className="min-w-[150px]"
                                      placeholder="Xe bán tải"
                                    />
                                    {errors[
                                      `subVariant_${variantIndex}_${subIndex}`
                                    ] && (
                                      <p className="text-red-500 text-sm mt-1">
                                        {
                                          errors[
                                            `subVariant_${variantIndex}_${subIndex}`
                                          ]
                                        }
                                      </p>
                                    )}
                                  </td>
                                  <td className="px-4 py-2">
                                    <TextInput
                                      type="number"
                                      value={subVariant.price}
                                      onChange={(e) =>
                                        handleSubVariantChange(
                                          e,
                                          variantIndex,
                                          subIndex,
                                          "price"
                                        )
                                      }
                                      className="min-w-[100px]"
                                      placeholder="300000"
                                    />
                                    {errors[
                                      `subPrice_${variantIndex}_${subIndex}`
                                    ] && (
                                      <p className="text-red-500 text-sm mt-1">
                                        {
                                          errors[
                                            `subPrice_${variantIndex}_${subIndex}`
                                          ]
                                        }
                                      </p>
                                    )}
                                  </td>
                                  <td className="px-4 py-2">
                                    <Textarea
                                      value={subVariant.description}
                                      onChange={(e) =>
                                        handleSubVariantChange(
                                          e,
                                          variantIndex,
                                          subIndex,
                                          "description"
                                        )
                                      }
                                      className="min-w-[150px] p-[10px]"
                                      rows={1}
                                      placeholder="Nhập mô tả"
                                    />
                                  </td>
                                  {/* <td className="px-4 py-2">
                                    <Textarea
                                      value={subVariant.instruction}
                                      onChange={(e) =>
                                        handleSubVariantChange(
                                          e,
                                          variantIndex,
                                          subIndex,
                                          "instruction"
                                        )
                                      }
                                      rows={2}
                                      className="min-w-[150px]"
                                      placeholder="Nhập hướng dẫn"
                                    />
                                  </td> */}
                                  <td className="px-4 py-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeSubVariant(variantIndex, subIndex)
                                      }
                                      className="text-red-500 hover:bg-red-500 hover:text-white border-[1px] border-red-500 rounded-md p-2 flex items-center justify-center"
                                    >
                                      <HiTrash className="text-xl" />
                                    </button>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => addSubVariant(variantIndex)}
                      className="mt-3 text-blue-600 hover:text-blue-400 flex items-center"
                    >
                      <i className="fas fa-plus"></i> Thêm biến thể con
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            onClick={handleAddProduct}
            disabled={isLoading}
          >
            Thêm sản phẩm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
