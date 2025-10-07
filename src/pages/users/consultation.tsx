/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Breadcrumb, Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import Pagination from "@/components/Pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import Consultation from "@/libs/user/consultation";
import { optionDate } from "@/libs/data";
import { queryClient } from "@/libs/query-client";

const ConsultationPage = () => {
  const [page, setPage] = useState(1);
  const [sessionToken, setSessionToken] = useState("");

  const { data, error, isFetching } = useQuery({
    queryKey: ["consultations", sessionToken, page],
    queryFn: async () => {
      if (!sessionToken) {
        throw new Error("Vui lòng đăng nhập để sử dụng tính năng này");
      }
      const res = await Consultation.list(page, sessionToken);
      return res;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!sessionToken,
  });

  const changePage = (type: string) => {
    switch (type) {
      case "next":
        if (Math.ceil(data.total / 10) === page) {
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

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedData = localStorage.getItem("userAccount");

    // Kiểm tra nếu có dữ liệu thì parse và lưu vào state
    if (storedData) {
      setSessionToken(localStorage.getItem("userAccount") || "");
    }
  }, []);

  const mutation = useMutation({
    mutationFn: async (body: any) => {
      const res = await Consultation.updateStatus(
        body.id,
        {
          status: body.action,
        },
        sessionToken
      );
      return res;
    },
    onSuccess: () => {
      // Làm mới truy vấn với queryKey
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const updateStatus = (id: string, action: string) => {
    mutation.mutate({ id: id, action: action });
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
              <Breadcrumb.Item>Yêu cầu tư vấn</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Yêu cầu tư vấn
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
                isLoading={isFetching}
                handleUpdate={updateStatus}
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

const ListTable = ({ data, isLoading, handleUpdate }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const openModal = (item) => {
    setSelectedQuestion(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuestion(null);
  };

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell className="p-4 text-center">Họ và tên</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Email</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Số điện thoại
        </Table.HeadCell>
        <Table.HeadCell className="w-[400px] min-w-[400px] p-4 text-center">
          Nội dung
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Thời gian</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Trạng thái</Table.HeadCell>

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
          data?.map((item) => (
            <Table.Row
              key={item.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-medium text-gray-900 dark:text-white">
                {item.fullName}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-medium text-gray-900 dark:text-white">
                {item.email}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-medium text-gray-900 dark:text-white">
                {item.phoneNumber}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-medium text-gray-900 dark:text-white">
                <div className="truncate max-w-xs cursor-pointer">
                  {item.question}
                </div>
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-normal text-gray-900 dark:text-white">
                {new Date(item.createdAt).toLocaleString("vi-VN", optionDate)}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap text-center p-4 text-base font-medium text-gray-900 dark:text-white">
                {item.status === "PENDING" ? (
                  <Badge className="justify-center" color="warning">
                    Đang chờ
                  </Badge>
                ) : (
                  <Badge className="justify-center" color="success">
                    Đã xử lý
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell className="p-4">
                <div className="flex items-center justify-center gap-x-3 whitespace-nowrap">
                  <Button
                    color="warning"
                    onClick={() => openModal(item)}
                  >
                    Xem chi tiết
                  </Button>
                  <Button
                    color="primary"
                    disabled={item.status !== "PENDING"}
                    onClick={() => handleUpdate(item.id, "DONE")}
                  >
                    Cập nhật trạng thái
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))
        )}

        <Modal show={showModal} onClose={closeModal}>
          <div className="max-h-[90vh] overflow-hidden flex flex-col">
            <Modal.Header>
              Chi tiết câu hỏi
            </Modal.Header>
            <Modal.Body className="overflow-y-auto">
              {selectedQuestion && (
                <div className="space-y-4">
                  {/* Thông tin người gửi */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Họ tên</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedQuestion.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedQuestion.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Số điện thoại</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedQuestion.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Thời gian</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(selectedQuestion.createdAt).toLocaleString("vi-VN", optionDate)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mr-3">Trạng thái</p>
                        <div>
                          {selectedQuestion.status === "PENDING" ? (
                            <Badge color="warning">Đang chờ</Badge>
                          ) : (
                            <Badge color="success">Đã xử lý</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nội dung câu hỏi */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Nội dung câu hỏi
                    </h3>
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <p className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {selectedQuestion.question}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <div className="flex justify-end gap-3 w-full">
                {selectedQuestion?.status === "PENDING" && (
                  <Button
                    color="primary"
                    onClick={() => {
                      handleUpdate(selectedQuestion.id, "DONE");
                      closeModal();
                    }}
                  >
                    Đánh dấu đã xử lý
                  </Button>
                )}
                <Button color="gray" onClick={closeModal}>
                  Đóng
                </Button>
              </div>
            </Modal.Footer>
          </div>
        </Modal>
      </Table.Body>
    </Table>
  );
};

export default ConsultationPage;
