import Platform from "@/libs/product/platform";
import { Button, Modal, Label, TextInput, Textarea } from "flowbite-react";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";

const EditPlatformModal = ({ data, setData, index }) => {
  const [isOpen, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: data.title,
    description: data.description,
  });

  const editPlatform = async () => {
    try {
      await Platform.update(
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
          <strong>Edit topic</strong>
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
          <Button color="primary" onClick={editPlatform}>
            Edit user
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default EditPlatformModal;
