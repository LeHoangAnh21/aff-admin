/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb, Button, Badge, Table } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import Pagination from "@/components/Pagination";
import Order from "@/libs/user/order";
import { optionDate, orderStatus } from "@/libs/data";
import CustomToast from "@/components/CustomToast";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { orderFilter as orderFilterStore } from "@/stores/users/order";
import Select from "react-select";
import { queryClient } from "@/libs/query-client";
import { useNavigate } from "react-router";
import SearchInput from "@/components/SearchInput";

const insuranceTypeArr = [
  {
    value: "01",
    label: "Bảo hiểm ô tô",
  },
  {
    value: "02",
    label: "Bảo hiểm xe máy",
  },
  {
    value: "03",
    label: "Bảo hiểm du lịch",
  },
];

const OrderPage = () => {
  const [isDisable, setIsDisable] = useState(false);
  const [sessionToken] = useState(localStorage.getItem("userAccount") || "");
  const [orderFilter, setOrderFilter] = useAtom(orderFilterStore);
  const [orderFilterSearch, setOrderFilterSearch] = useState({
    page: 1,
    pageSize: 10,
    status: [],
    orderCode: "",
  });

  const { data, isPending, refetch, isRefetching } = useQuery({
    queryKey: ["orders", sessionToken, orderFilterSearch],
    queryFn: async () => {
      if (!sessionToken) {
        throw new Error("Vui lòng đăng nhập để sử dụng tính năng này");
      }
      const status =
        orderFilterSearch.status.map((item: any) => item.value) || [];

      const res = await Order.listOrderAdmin(
        {
          ...orderFilterSearch,
          status: status,
          orderCode: parseInt(orderFilterSearch.orderCode),
        },
        sessionToken
      );
      return res;
    },
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });

  const changePage = (type: string) => {
    switch (type) {
      case "next":
        if (Math.ceil(data.metadata.total / 10) === orderFilter.page) {
          break;
        }
        setOrderFilter((pre) => ({ ...pre, page: orderFilter.page + 1 }));
        setOrderFilterSearch((pre) => ({ ...pre, page: orderFilter.page + 1 }));

        break;
      case "back":
        if (orderFilter.page === 1) {
          break;
        }
        setOrderFilter((pre) => ({ ...pre, page: orderFilter.page - 1 }));
        setOrderFilterSearch((pre) => ({ ...pre, page: orderFilter.page - 1 }));

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (sessionToken) {
      refetch();
    }
  }, [orderFilterSearch]);

  const mutation = useMutation({
    mutationFn: async (body: any) => {
      const res = await Order.updateOrderStatusAdmin(
        body.id,
        {
          statusCode: body.action,
        },
        sessionToken
      );

      return res;
    },
    onSuccess: (data) => {
      // Làm mới truy vấn với queryKey
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Cập nhật trạng thái đơn hàng thành công!", {
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
        title={"Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này?"}
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

  const handleExportFile = async () => {
    try {
      const res = await Order.exportOrder(sessionToken);
      toast.success("Xuất File đơn hàng thành công", {
        autoClose: 5000,
      });

      const url = window.URL.createObjectURL(new Blob([res]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Đơn hàng bảo hiểm 1 chạm.xlsx"); // Đặt tên file tải về
      document.body.appendChild(link);
      link.click();

      // Dọn dẹp sau khi tải
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.log(error.message);
    }
  };

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
              <Breadcrumb.Item>Đơn hàng</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Tất cả đơn hàng
            </h1>
          </div>
          <div className="sm:flex flex-col gap-5">
            <div className="flex gap-5 items-center">
              <Select
                placeholder={"Chọn trạng thái đơn hàng"}
                value={orderFilter.status}
                styles={{
                  multiValueLabel: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.data.bgColor,
                    // color: state.data.color,
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
                onChange={(value: any) => {
                  setOrderFilter((pre) => ({
                    ...pre,
                    status: value,
                    page: 1,
                  }));
                }}
                options={orderStatus}
                isMulti
                className="w-[300px]"
              />
              <SearchInput
                type="text"
                value={orderFilter.orderCode}
                onChange={(e: any) => {
                  setOrderFilter((pre: any) => ({
                    ...pre,
                    orderCode: e.target.value,
                    page: 1,
                  }));
                }}
                placeholder="Tìm kiếm theo mã đơn hàng"
                className="inline-block w-full max-w-[300px]"
              />
              <Button
                className="mr-auto"
                onClick={async () => {
                  setOrderFilterSearch(orderFilter);
                }}
              >
                Tìm kiếm
              </Button>
              <Button color="warning" onClick={handleExportFile}>
                Xuất File
              </Button>
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
                isDisable={isDisable}
                handleUpdate={updateOrderStatus}
              />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        changePage={changePage}
        total={data?.metadata?.total}
        page={orderFilter.page}
      />
    </NavbarSidebarLayout>
  );
};

const ListTable = ({ data, isLoading, handleUpdate, isDisable }) => {
  const navigate = useNavigate();

  const checkDisable = (orderStatus: string) => {
    return (
      ["COMPLETED", "CANCELED", "REJECTED"].find(
        (value) => value === orderStatus
      ) !== undefined
    );
  };

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell className="p-4 text-center">
          Loại bảo hiểm
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Mã đơn hàng</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center w-[12%]">
          Trạng thái đơn
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center w-[12%]">
          Trạng thái thanh toán
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Giá (VNĐ)</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Người mua</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Thời gian</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Thao tác</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {isLoading ? (
          <Table.Row>
            <Table.Cell className="p-4" colSpan={9}>
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
          data?.map((item, index) => (
            <Table.Row
              key={item.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-medium text-gray-900 dark:text-white">
                {
                  insuranceTypeArr.filter(
                    (value) => value.value === item.insuranceType
                  )[0]?.label
                }
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {item.orderCode}
              </Table.Cell>
              <Table.Cell
                className={` whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white`}
              >
                <Badge
                  className="justify-center"
                  color={
                    orderStatus.filter(
                      (order) => order.defaultValue === item.orderStatus
                    )[0]?.color
                  }
                >
                  {
                    orderStatus.filter(
                      (order) => order.defaultValue === item.orderStatus
                    )[0]?.label
                  }
                </Badge>
                {/* {item.orderStatus === "PENDING" ? (
                  <Badge className="justify-center" color="warning">
                    Đang chờ
                  </Badge>
                ) : item.orderStatus === "REJECTED" ? (
                  <Badge className="justify-center" color="failure">
                    Đã từ chối
                  </Badge>
                ) : (
                  <Badge className="justify-center" color="success">
                    Thành công
                  </Badge>
                )} */}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
                {item.paymentStatus === "PENDING" ? (
                  <Badge className="justify-center" color="warning">
                    Đang chờ
                  </Badge>
                ) : item.paymentStatus === "REJECTED" ? (
                  <Badge className="justify-center" color="failure">
                    Đã hủy
                  </Badge>
                ) : item.paymentStatus === "REFUNDED" ? (
                  <Badge className="justify-center" color="failure">
                    Đã hoàn tiền
                  </Badge>
                ) : (
                  <Badge className="justify-center" color="success">
                    Thành công
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {item.price.toLocaleString("vi-VN")}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {item.user.fullname}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {new Date(item.createdAt).toLocaleString("vi-VN", optionDate)}
              </Table.Cell>

              <Table.Cell className="p-4">
                <div
                  className={`flex items-center justify-center gap-x-3 whitespace-nowrap`}
                >
                  {/* <EditUserModal data={item} index={index} getList={getList} /> */}
                  {/* <DeleteUserModal /> */}
                  <Select
                    placeholder={"Chọn trạng thái"}
                    isDisabled={checkDisable(item.orderStatus)}
                    value={"01"}
                    classNames={{
                      menu: () => "dark:bg-gray-700",
                      control: () => "dark:bg-gray-700",
                      singleValue: () => "dark:text-white",
                      option: (state) =>
                        `cursor-pointer 
                    ${state.isSelected ? "dark:text-white" : "dark:text-white"} 
                    `,
                      placeholder: () =>
                        `${
                          checkDisable(item.orderStatus)
                            ? ""
                            : "dark:text-white"
                        }`,
                    }}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary25: "#b2d4ff",
                        primary: "#2684ff",
                      },
                    })}
                    onChange={(value: any) => {
                      handleUpdate(item.id, value.value);
                    }}
                    options={orderStatus}
                    className="min-w-[200px]"
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                  />
                  <Button onClick={() => navigate(`${item.id}`)}>
                    Xem chi tiết
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

export default OrderPage;
