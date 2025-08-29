import { Button, Modal, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { HiCash } from "react-icons/hi";

const WithdrawModal = ({ value, handleWithdraw, setAmountWithdraw }: any) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiCash className="text-xl" />
          Rút tiền
        </div>
      </Button>
      <Modal size={"sm"} onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Rút tiền</strong>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <Label htmlFor="balance">Số dư muốn rút:</Label>
              <div className="mt-1">
                <TextInput
                  id="balance"
                  name="balance"
                  placeholder="Nhập số dư muốn rút"
                  value={value}
                  onChange={(e: any) => {
                    setAmountWithdraw(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
          <Button
            color="primary"
            onClick={() => {
              handleWithdraw();
              setOpen(false);
            }}
          >
            Rút tiền
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default WithdrawModal;
