import Category from "@/libs/product/category";
import {
  Button,
  Modal,
  Label,
  TextInput,
  Textarea,
  Select,
} from "flowbite-react";
import { useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi";

const AddCategoryModal = ({ setData, platformData }) => {
  const [isOpen, setOpen] = useState(false);
  // const [isFocus, setIsFocus] = useState(false);
  const [addData, setAddData] = useState<any>({
    title: "",
    description: "",
    platform_id: "",
    genre_category: [],
  });
  const [genreCategory, setGenreCategory] = useState("");

  const addCategory = async () => {
    try {
      const data = await Category.create(
        addData,
        localStorage.getItem("userAccount")
      );

      setData((prevData) => ({
        data: [...prevData.data, data],
        total: prevData.total + 1,
      }));
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Category
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new Category</strong>
        </Modal.Header>
        <Modal.Body className="overflow-auto max-h-[601px]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <div className="mt-1">
                <TextInput
                  id="title"
                  name="title"
                  value={addData.title}
                  onChange={(e) =>
                    setAddData({ ...addData, title: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="col-span-2">
              <Label htmlFor="platform_id">Platform</Label>
              <Select
                id="platform_id"
                className="mt-1"
                value={addData.platform_id}
                onChange={(e) =>
                  setAddData({ ...addData, platform_id: e.target.value })
                }
              >
                <option value="">Please choose an platform</option>
                {platformData.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </Select>
            </div>
            <div className="col-span-2 flex flex-col gap-[10px]">
              <Label htmlFor="title">Category genre</Label>
              <div className="flex flex-col gap-[5px]">
                {addData.genre_category.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Label className=" w-full text-[#1c64f2] dark:text-[#1c64f2]">
                      {item}
                    </Label>
                    <Button
                      color="primary"
                      onClick={() => {
                        setAddData({
                          ...addData,
                          genre_category: addData.genre_category.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                    >
                      <div className="flex items-center">
                        <HiMinus className="text-sm" />
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-1 flex gap-[10px]">
                <TextInput
                  id="title"
                  name="title"
                  value={genreCategory}
                  className="w-full"
                  onChange={(e) => setGenreCategory(e.target.value)}
                />
                <Button
                  color="primary"
                  onClick={() => {
                    if (
                      !genreCategory ||
                      addData.genre_category.includes(genreCategory)
                    ) {
                      return;
                    }
                    setAddData({
                      ...addData,
                      genre_category: [
                        ...addData.genre_category,
                        genreCategory,
                      ],
                    });
                    setGenreCategory("");
                  }}
                >
                  <div className="flex items-center">
                    <HiPlus className="text-xl" />
                  </div>
                </Button>
              </div>
            </div>
            <div className="col-span-2">
              <Label htmlFor="desciption">Desciption</Label>
              <Textarea
                id="desciption"
                name="desciption"
                rows={6}
                className="mt-1"
                value={addData.description}
                onChange={(e) =>
                  setAddData({ ...addData, description: e.target.value })
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button color="primary" onClick={addCategory}>
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddCategoryModal;
