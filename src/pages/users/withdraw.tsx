/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb, Button, Badge, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome, HiTrash } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import Pagination from "@/components/Pagination";
import { toast } from "react-toastify";
import { optionDate, withdrawStatus } from "@/libs/data";
import Withdraw from "@/libs/user/withdraw";
import CustomToast from "@/components/CustomToast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { withdrawFilter as withdrawFilterStore } from "@/stores/users/withdraw";
import Select from "react-select";
import { queryClient } from "@/libs/query-client";

const WithdrawPage = () => {
  const [isDisable, setIsDisable] = useState(false);
  const [sessionToken, setSessionToken] = useState("");
  const [withdrawFilter, setWithdrawFilter] = useAtom(withdrawFilterStore);

  const { data, error, isPending } = useQuery({
    queryKey: [
      "withdrawals",
      sessionToken,
      withdrawFilter.status,
      withdrawFilter.page,
    ],
    queryFn: async () => {
      if (!sessionToken) {
        throw new Error("Vui lòng đăng nhập để sử dụng tính năng này");
      }

      const status = withdrawFilter.status.map((item: any) => item.value) || [];

      const res = await Withdraw.withdrawal(
        {
          ...withdrawFilter,
          status: status,
        },
        sessionToken
      );
      return res;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!sessionToken,
  });

  const mutation = useMutation({
    mutationFn: async (body: any) => {
      const res = await Withdraw.updateWithdrawalStatusAdmin(
        body.id,
        {
          status: body.action,
        },
        sessionToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      setWithdrawFilter({ ...withdrawFilter, page: 1 });
      toast.success("Cập nhật trạng thái thành công!", {
        autoClose: 5000,
      });
    },
    onError: (error) => {
      console.log(error.message);
      toast.error("Cập nhật trạng thái đơn hàng thất bại!", {
        autoClose: 5000,
      });
    },
    retry: 0,
  });

  const updateOrderStatus = (id: string, action: string) => {
    setIsDisable(true);
    toast(
      <CustomToast
        title={
          action === "DONE"
            ? "Bạn có chắc chắn muốn phê duyệt yêu cầu này?"
            : "Bạn có chắc chắn muốn từ chối yêu cầu này?"
        }
        confirm={() => {
          mutation.mutate({ id: id, action: action });
        }}
        setIsDisable={setIsDisable}
      />,
      {
        onClose: () => {
          setIsDisable(false);
        },
      }
    );
  };

  const handleChangeStatus = (value) => {
    setWithdrawFilter((pre) => ({
      ...pre,
      status: value,
      page: 1,
    }));
  };

  const changePage = (type: string) => {
    switch (type) {
      case "next":
        if (Math.ceil(data.meta.total / 10) === withdrawFilter.page) {
          break;
        }
        setWithdrawFilter((pre) => ({ ...pre, page: withdrawFilter.page + 1 }));
        break;
      case "back":
        if (withdrawFilter.page === 1) {
          break;
        }
        setWithdrawFilter((pre) => ({ ...pre, page: withdrawFilter.page - 1 }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedData = localStorage.getItem("userAccount");

    // Kiểm tra nếu có dữ liệu thì parse và lưu vào state
    if (storedData) {
      setSessionToken(localStorage.getItem("userAccount") || "");
    }
  }, []);

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Trang chủ</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/users/list">Người dùng</Breadcrumb.Item>
              <Breadcrumb.Item>Rút tiền</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Danh sách rút tiền
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <Select
                placeholder={"Chọn trạng thái"}
                value={withdrawFilter.status}
                styles={{
                  multiValueLabel: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.data.bgColor,
                    color: state.data.color,
                  }),
                }}
                classNames={{
                  menu: () => "dark:bg-gray-700",
                  control: () => "dark:bg-gray-700",
                  singleValue: () => "dark:text-white",
                  option: (state) =>
                    `cursor-pointer 
                    ${state.isSelected ? "dark:text-white" : "dark:text-white"} 
                    `,
                  placeholder: () => `dark:text-white`,
                }}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#b2d4ff",
                    primary: "#2684ff",
                  },
                })}
                onChange={(value: any) => handleChangeStatus(value)}
                options={withdrawStatus}
                isMulti
                className="min-w-[300px]"
              />{" "}
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              {/* <AddUserModal /> */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <ListTable
                data={data?.data}
                isLoading={isPending}
                handleUpdate={updateOrderStatus}
                isDisable={isDisable}
              />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        changePage={changePage}
        total={data?.meta?.total}
        page={data?.meta?.page}
      />
    </NavbarSidebarLayout>
  );
};

const ListTable = ({ data, isLoading, handleUpdate, isDisable }) => {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell className="p-4 text-center">
          Người gửi yêu cầu
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Email</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Số điện thoại
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Tên ngân hàng
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Số tài khoản
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Chủ tài khoản
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Số tiền rút (VNĐ)
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Thời gian</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Trạng thái</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Thao tác</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {isLoading ? (
          <Table.Row>
            <Table.Cell className="p-4" colSpan={10}>
              <div role="status" className="w-full flex justify-center">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>{" "}
            </Table.Cell>
          </Table.Row>
        ) : (
          data?.map((item) => (
            <Table.Row
              key={item.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {item.user.fullname}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {item.user.email}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {item.user.phoneNumber}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {item.user.bankName}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {item.user.accNum}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {item.user.accountOwner}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {item.amount.toLocaleString("vi-VN")}
              </Table.Cell>

              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {new Date(item.createdAt).toLocaleString("vi-VN", optionDate)}
              </Table.Cell>
              <Table.Cell
                className={` whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white`}
              >
                {item.status === "PENDING" ? (
                  <Badge className="justify-center" color="warning">
                    Đang chờ
                  </Badge>
                ) : item.status === "REJECTED" ? (
                  <Badge className="justify-center" color="failure">
                    Đã từ chối
                  </Badge>
                ) : item.status === "CANCELLED" ? (
                  <Badge className="justify-center" color="failure">
                    Đã hủy
                  </Badge>
                ) : (
                  <Badge className="justify-center" color="success">
                    Thành công
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell className="p-4">
                <div className="flex justify-center items-center gap-x-3 whitespace-nowrap">
                  {/* <EditUserModal data={item} index={index} getList={getList} /> */}
                  {/* <DeleteUserModal /> */}
                  <Button
                    color="primary"
                    disabled={isDisable || item.status !== "PENDING"}
                    onClick={() => handleUpdate(item.id, "DONE")}
                  >
                    Xác nhận
                  </Button>
                  <Button
                    color="failure"
                    disabled={isDisable || item.status !== "PENDING"}
                    onClick={() => handleUpdate(item.id, "REJECTED")}
                  >
                    Từ chối
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  );
};

export default WithdrawPage;
