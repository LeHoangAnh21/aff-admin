import { Button, Modal, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";

const AddUserModal = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Thêm người dùng
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Thêm người dùng mới</strong>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="lastName">Họ</Label>
              <div className="mt-1">
                <TextInput id="lastName" name="lastName" placeholder="Nguyễn" />
              </div>
            </div>
            <div>
              <Label htmlFor="firstName">Tên</Label>
              <div className="mt-1">
                <TextInput
                  id="firstName"
                  name="firstName"
                  placeholder="Văn A"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1">
                <TextInput
                  id="email"
                  name="email"
                  placeholder="example@company.com"
                  type="email"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <div className="mt-1">
                <TextInput
                  id="phone"
                  name="phone"
                  placeholder="e.g., +(12)3456 789"
                  type="tel"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="department">Username</Label>
              <div className="mt-1">
                <TextInput
                  id="department"
                  name="department"
                  placeholder="abcxyz"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role">Vai trò</Label>
              <div className="mt-1">
                <TextInput id="role" name="role" placeholder="Admin" required />
              </div>
            </div>
            <div>
              <Label htmlFor="psw">Mật khẩu</Label>
              <div className="mt-1">
                <TextInput id="psw" name="psw" required />
              </div>
            </div>
            {/* <div>
              <Label htmlFor="c-psw">Confirm Password</Label>
              <div className="mt-1">
                <TextInput id="c-psw" name="c-psw" required />
              </div>
            </div> */}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button color="primary" onClick={() => setOpen(false)}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddUserModal;
