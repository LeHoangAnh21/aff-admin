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

const EditCategoryModal = ({ data, setData, index, platformData }) => {
  const [isOpen, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: data.title,
    description: data.description,
    platform_id: data.platform_id,
    genre_category: data.genre_category,
  });
  const [genreCategory, setGenreCategory] = useState("");

  const editCategory = async () => {
    try {
      await Category.update(
        data.id,
        editData,
        localStorage.getItem("userAccount")
      );

      setData((prevData) => ({
        ...prevData,
        data: prevData.data.map((item, idx) =>
          idx === index ? { ...item, ...editData } : item
        ),
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
          Edit
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit category</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <div className="mt-1">
                <TextInput
                  id="title"
                  name="title"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="col-span-2">
              <Label htmlFor="platform_id">Platform</Label>
              <Select
                id="platform_id"
                className="mt-1"
                value={editData.platform_id}
                onChange={(e) =>
                  setEditData({ ...editData, platform_id: e.target.value })
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
                {editData.genre_category.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Label className=" w-full text-[#1c64f2] dark:text-[#1c64f2]">
                      {item}
                    </Label>
                    <Button
                      color="primary"
                      onClick={() => {
                        setEditData({
                          ...editData,
                          genre_category: editData.genre_category.filter(
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
                      editData.genre_category.includes(genreCategory)
                    ) {
                      return;
                    }
                    setEditData({
                      ...editData,
                      genre_category: [
                        ...editData.genre_category,
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
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button color="primary" onClick={editCategory}>
            Edit user
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default EditCategoryModal;
