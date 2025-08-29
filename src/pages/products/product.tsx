/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Badge,
  Breadcrumb,
  Button,
  Checkbox,
  Modal,
  Spinner,
  Table,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { HiHome, HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { EditProductModal } from "@/components/product/EditProductModal";
import Pagination from "@/components/Pagination";
import Product from "@/libs/product/product";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/libs/query-client";
import { useAtom } from "jotai";
import { productFilter as productFilterStore } from "@/stores/products/product";

const ProductPage = () => {
  const [productFilter, setProductFilter] = useAtom(productFilterStore);
  const [sessionToken, setSessionToken] = useState("");

  const { data, error, isFetching } = useQuery({
    queryKey: ["products", sessionToken, productFilter.page],
    queryFn: async () => {
      if (!sessionToken) {
        throw new Error("Vui lòng đăng nhập để sử dụng tính năng này");
      }
      const res = await Product.list(productFilter, sessionToken);
      return res;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!sessionToken,
  });

  const changePage = (type: string) => {
    switch (type) {
      case "next":
        if (Math.ceil(data.total / 10) === productFilter.page) {
          break;
        }
        setProductFilter((pre) => ({ ...pre, page: productFilter.page + 1 }));
        break;
      case "back":
        if (productFilter.page === 1) {
          break;
        }
        setProductFilter((pre) => ({ ...pre, page: productFilter.page - 1 }));
        break;
      default:
        break;
    }
  };

  const mutationEdit = useMutation({
    mutationFn: async (body: any) => {
      const res = await Product.update(
        body.id,
        {
          price: body.price,
        },
        sessionToken
      );
      return res;
    },
    onSuccess: () => {
      // Làm mới truy vấn với queryKey
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      setProductFilter({ ...productFilter, page: 1 });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

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
              <Breadcrumb.Item href="/e-commerce/products">
                Sản phẩm
              </Breadcrumb.Item>
              <Breadcrumb.Item>Danh sách</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Quản lý sản phẩm
            </h1>
          </div>
          <div className="block items-center sm:flex">
            {/* <SearchInput
              value={search}
              handleChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm kiếm sản phẩm theo tên"
            /> */}
            {/* <div className="flex w-full items-center sm:justify-end">
              <AddProductModal getList={getList} />
            </div> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <ProductsTable
                data={data?.data}
                isLoading={isFetching}
                handleDelete={() => {}}
                handleUpdate={(body) => {
                  mutationEdit.mutate(body);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        changePage={changePage}
        total={data?.total}
        page={productFilter.page}
      />
    </NavbarSidebarLayout>
  );
};

// const DeleteProductModal = ({ id, handleDelete }) => {
//   const [isOpen, setOpen] = useState(false);
//   const deleteItem = async () => {
//     try {
//       await Product.delete(id, localStorage.getItem("userAccount"));
//     } catch (e: any) {
//       console.log(e.message);
//     } finally {
//       setOpen(false);
//     }
//   };
//   return (
//     <>
//       <Button color="failure" onClick={() => setOpen(!isOpen)}>
//         <HiTrash className="mr-2 text-lg" />
//         Xóa
//       </Button>
//       <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
//         <Modal.Header className="px-3 pb-0 pt-3">
//           <span className="sr-only">Xóa sản phẩm</span>
//         </Modal.Header>
//         <Modal.Body className="px-6 pb-6 pt-0">
//           <div className="flex flex-col items-center gap-y-6 text-center">
//             <HiOutlineExclamationCircle className="text-7xl text-red-600" />
//             <p className="text-lg text-gray-500 dark:text-gray-300">
//               Are you sure you want to delete this product?
//             </p>
//             <div className="flex items-center gap-x-3">
//               <Button color="failure" onClick={deleteItem}>
//                 Yes, I'm sure
//               </Button>
//               <Button color="gray" onClick={() => setOpen(false)}>
//                 No, cancel
//               </Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// };

const ProductsTable = ({ data, isLoading, handleDelete, handleUpdate }) => {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell className="p-4 text-center">
          Tên sản phẩm
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Giá (VNĐ)</Table.HeadCell>

        {/* <Table.HeadCell className="p-4">Loại bảo hiểm</Table.HeadCell>
        <Table.HeadCell className="p-4">Hướng dẫn</Table.HeadCell>
        <Table.HeadCell className="p-4">Thời gian</Table.HeadCell> */}
        <Table.HeadCell className="p-4 text-center">Thao tác</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {isLoading ? (
          <Table.Row>
            <Table.Cell className="p-4" colSpan={8}>
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
          <>
            {data?.map((item) => (
              <Table.Row
                key={item.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 "
              >
                <Table.Cell
                  className="w-[calc(100%/3)] text-center p-4 text-base font-medium text-gray-900 dark:text-white"
                  title={item.title}
                >
                  {item.title}
                </Table.Cell>
                <Table.Cell
                  className="w-[calc(100%/3)] text-center p-4 text-base font-medium text-gray-900 dark:text-white"
                  title={item.price}
                >
                  {item.price.toLocaleString("vi-VN")}
                </Table.Cell>
                <Table.Cell className="w-[calc(100%/3)] space-x-2 whitespace-nowrap p-4">
                  <div className="flex items-center justify-center gap-x-3">
                    <EditProductModal data={item} handleUpdate={handleUpdate} />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </>
        )}
      </Table.Body>
    </Table>
  );
};

export default ProductPage;
