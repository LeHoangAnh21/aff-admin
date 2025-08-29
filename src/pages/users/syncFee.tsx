import Loading from "@/components/Loading";
import NavbarSidebarLayout from "@/layouts/navbar-sidebar";
import Account from "@/libs/user/account";
import { userFilter } from "@/stores/users/account";
import { Breadcrumb, Select, Pagination, Button } from "flowbite-react";
import { useState } from "react";
import { HiHome } from "react-icons/hi";
import { toast } from "react-toastify";

export default function SyncFeePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const res = await Account.syncFee(localStorage.getItem("userAccount"));
      console.log(res);
      setTimeout(() => {
        setIsLoading(false);

        toast.success("Đồng bộ phí hoa hồng thành công!", {
          autoClose: 5000,
        });
      }, 500);
    } catch (error: any) {
      console.log(error.message);
      setTimeout(() => {
        setIsLoading(false);

        toast.error(error.message, {
          autoClose: 5000,
        });
      }, 500);
    }
  };
  return (
    <>
      <NavbarSidebarLayout isFooter={false}>
        <div className="flex h-[calc(100vh-64px)] flex-col border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-1 w-full">
            <div className="mb-4">
              <Breadcrumb className="mb-4">
                <Breadcrumb.Item href="#">
                  <div className="flex items-center gap-x-3">
                    <HiHome className="text-xl" />
                    <span className="dark:text-white">Trang chủ</span>
                  </div>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="/fee">
                  Đồng bộ phí hoa hồng
                </Breadcrumb.Item>
              </Breadcrumb>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                Đồng bộ phí hoa hồng
              </h1>
            </div>
            <div className="sm:flex ">
              <div className="mb-3 items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100"></div>
              {/* <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
                      <AddUserModal />
                    </div> */}
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col">
              <Button disabled={isLoading} onClick={handleSync}>
                Đồng Bộ Hoa Hồng
              </Button>
            </div>
          </div>
        </div>
      </NavbarSidebarLayout>
      <Loading isLoading={isLoading} />
    </>
  );
}
