import { Button, Modal, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import Account from "@/libs/user/account";

const EditUserModal = ({ data, index, getList }) => {
  const [isOpen, setOpen] = useState(false);
  const [editData, setEditData] = useState({
    fullname: data.fullname,
    email: data.email,
    phone_number: data.phone_number,
    role: data.role,
    balance: data.balance,
  });

  const editUser = async () => {
    try {
      await Account.updateUser(
        data.id,
        editData,
        localStorage.getItem("userAccount")
      );
      getList();
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
          Sửa
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Sửa thông tin người dùng</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="fullName">Họ và tên</Label>
              <div className="mt-1">
                <TextInput
                  id="fullName"
                  name="fullName"
                  value={editData.fullname}
                  onChange={(e) =>
                    setEditData({ ...editData, fullname: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1">
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <div className="mt-1">
                <TextInput
                  id="phone"
                  name="phone"
                  type="tel"
                  value={editData.phone_number}
                  onChange={(e) =>
                    setEditData({ ...editData, phone_number: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role">Vai trò</Label>
              <div className="mt-1">
                <TextInput
                  id="role"
                  name="role"
                  value={editData.role}
                  required
                  onChange={(e) =>
                    setEditData({ ...editData, role: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role">Số dư</Label>
              <div className="mt-1">
                <TextInput
                  id="balance"
                  name="balance"
                  type="number"
                  value={editData.balance}
                  required
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      balance: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button color="primary" onClick={editUser}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default EditUserModal;
