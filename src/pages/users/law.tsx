/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb, Button, Modal, Table } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { HiHome, HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import SearchInput from "@/components/SearchInput";
import { useDebounce } from "use-debounce";
import AddUserModal from "@/components/user/AddUserModal";
import EditUserModal from "@/components/user/EditUserModal";
import Pagination from "@/components/Pagination";
import { userSearch as userSearchStore } from "@/stores/users/user";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import Order from "@/libs/user/order";
import { insuranceType, optionDate } from "@/libs/data";
import CustomToast from "@/components/CustomToast";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "@/libs/api";
import AddLawModal from "@/components/law/AddLawModal";
import EditLawModal from "@/components/law/EditLawModal";
import Law from "@/libs/user/law";

const LawPage = () => {
  const [search, setSearch] = useAtom(userSearchStore);
  const [searchFilter] = useDebounce(search, 300);
  // const [data, setData] = useState({ data: [], total: 0 });
  // const [isLoading, setIsLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [lawType, setLawType] = useState("01");
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  // Hook useQuery để lấy danh sách dữ liệu
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["laws", page, lawType], // queryKey phụ thuộc vào page
    queryFn: async () => {
      const response = (await API.get(
        `/api/laws`,
        // `/api/laws?lawType=${lawType}&page=${page}&limit=10`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userAccount")}`,
          },
        }
      )) as any;
      return response;
    },
  });

  const handleTypeChange = (newType) => {
    setLawType(newType);
    setPage(1); // Reset về trang 1 khi type thay đổi
  };

  const changePage = (type: string) => {
    switch (type) {
      case "next":
        if (Math.ceil(data.meta.total / 10) === page) {
          break;
        }
        setPage(page + 1);
        break;
      case "back":
        if (page === 1) {
          break;
        }
        setPage(page - 1);
        break;
      default:
        break;
    }
  };

  const handleAddLaw = useMutation({
    mutationFn: async (newUser) => {
      const res = await Law.create(
        newUser,
        localStorage.getItem("userAccount")
      );
    },

    onSuccess: () => {
      // Làm mới danh sách người dùng
      queryClient.invalidateQueries({ queryKey: ["laws"] });
      // Reset form
      toast.success("Thêm luật mới thành công!", {
        autoClose: 5000,
      });
    },
    onError: (error) => {
      if (error.message.includes("already exists")) {
        toast.error("Luật đã tồn tại, không thể thêm mới!", {
          autoClose: 5000,
        });
      }
    },
  });

  const handleEditLaw = useMutation({
    mutationFn: async (data: { id: string; body: any }) => {
      const res = await Law.edit(
        data.id,
        data.body,
        localStorage.getItem("userAccount")
      );
    },

    onSuccess: () => {
      // Làm mới danh sách người dùng
      queryClient.invalidateQueries({ queryKey: ["laws"] });
      // Reset form
      setPage(1);
      toast.success("Cập nhật luật thành công!", {
        autoClose: 5000,
      });
    },
    onError: (error) => {
      // if (error.message.includes("already exists")) {
      toast.error(error.message, {
        autoClose: 5000,
      });
      // }
    },
  });

  const handleDeleteLaw = useMutation({
    mutationFn: async (id) => {
      const res = await Law.delete(id, localStorage.getItem("userAccount"));
    },

    onSuccess: () => {
      // Làm mới danh sách người dùng
      queryClient.invalidateQueries({ queryKey: ["laws"] });
      // Reset form
      setPage(1);
      toast.success("Xóa thành công!", {
        autoClose: 5000,
      });
    },
    onError: (error) => {
      // if (error.message.includes("already exists")) {
      toast.error(error.message, {
        autoClose: 5000,
      });
      // }
    },
  });

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
              <Breadcrumb.Item>Luật</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Luật bảo hiểm
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              {/* <SearchInput
                value={search.value}
                handleChange={(e) =>
                  setSearch({ value: e.target.value, page: 1 })
                }
                placeholder=""
              /> */}
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <AddLawModal
                handleAddLaw={(value) => handleAddLaw.mutate(value)}
              />
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
                // setData={setData}
                isLoading={isLoading}
                isDisable={isDisable}
                handleUpdate={(value) => handleEditLaw.mutate(value)}
                handleDelete={(value) => handleDeleteLaw.mutate(value)}
              />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        changePage={changePage}
        total={data?.meta?.total}
        page={page}
      />
    </NavbarSidebarLayout>
  );
};

const ListTable = ({
  data,
  setData,
  isLoading,
  handleUpdate,
  handleDelete,
}: any) => {
  console.log(data);

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell className="p-4 text-center">
          Loại bảo hiểm
        </Table.HeadCell>
        {/* <Table.HeadCell className="p-4 text-center">Nội dung</Table.HeadCell> */}

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
          data.map((item, index) => (
            <Table.Row
              key={item.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-medium text-gray-900 dark:text-white">
                {
                  insuranceType.filter(
                    (value: any) => value.value === item.lawType
                  )[0]?.title
                }
              </Table.Cell>
              {/* <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-medium text-gray-900 dark:text-white">
                <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
              </Table.Cell> */}
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {new Date(item.createdAt).toLocaleString("vi-VN", optionDate)}
              </Table.Cell>
              <Table.Cell className="p-4">
                <div className="flex items-center justify-center gap-x-3 whitespace-nowrap">
                  <EditLawModal data={item} handleUpdate={handleUpdate} />
                  <DeleteModal
                    id={item.id}
                    handleDelete={handleDelete}
                  ></DeleteModal>
                </div>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  );
};

const DeleteModal = ({ id, handleDelete }: any) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="failure" onClick={() => setOpen(!isOpen)}>
        <HiTrash className="mr-2 text-lg" />
        Delete
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-3 pb-0 pt-3">
          <span className="sr-only">Xóa luật</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-600" />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Bạn có chắc chắn muốn xóa luật của bảo hiểm này ?
            </p>
            <div className="flex items-center gap-x-3">
              <Button
                color="failure"
                onClick={() => {
                  handleDelete(id);
                  setOpen(false);
                }}
              >
                Có
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                Không
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LawPage;
