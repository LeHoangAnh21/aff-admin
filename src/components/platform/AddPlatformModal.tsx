import Platform from "@/libs/product/platform";
import { Button, Modal, Label, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";

const AddPlatformModal = ({ setData, data }) => {
  const [isOpen, setOpen] = useState(false);
  const [addData, setAddData] = useState({
    title: "",
    description: "",
  });

  const addPlatform = async () => {
    try {
      const newData = await Platform.create(
        addData,
        localStorage.getItem("userAccount")
      );

      setData({ ...data, data: [...data, newData] });
      setAddData({
        title: "",
        description: "",
      });
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
          Add Platform
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new Platform</strong>
        </Modal.Header>
        <Modal.Body>
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
          <Button color="primary" onClick={addPlatform}>
            Add Platform
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddPlatformModal;
