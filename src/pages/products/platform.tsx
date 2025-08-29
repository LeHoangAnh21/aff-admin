/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb, Button, Checkbox, Modal, Table } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { HiHome, HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import AddPlatformModal from "@/components/platform/AddPlatformModal";
import EditPlatformModal from "@/components/platform/EditPlatformModal";
import SearchInput from "@/components/SearchInput";
import { useDebounce } from "use-debounce";
import Pagination from "@/components/Pagination";
import Platform from "@/libs/product/platform";
import {
  platformData as platformDataStore,
  platformPage as platformPageStore,
  platformSearch as platformSearchStore,
} from "@/stores/products/platform";
import { useAtom } from "jotai";

const PlatformPage = () => {
  const [search, setSearch] = useAtom(platformSearchStore);
  const [searchFilter] = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useAtom(platformPageStore);
  const [data, setData] = useAtom(platformDataStore);
  const [isLoading, setIsLoading] = useState(false);

  const onPageChange = (page: number) => setCurrentPage(page);

  const changePage = (type: string) => {
    switch (type) {
      case "next":
        if (Math.ceil(data.total / 10) === currentPage) {
          break;
        }
        setCurrentPage((pre) => pre + 1);
        break;
      case "back":
        if (currentPage === 1) {
          break;
        }
        setCurrentPage((pre) => pre - 1);
        break;
      default:
        break;
    }
  };

  const getList = async () => {
    setIsLoading(true);
    try {
      let data = {};

      if (!searchFilter) {
        data = await Platform.list(currentPage);
      } else {
        data = await Platform.search(searchFilter, currentPage);
      }
      setData(data);
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, [currentPage, searchFilter]);

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item>E-commerce</Breadcrumb.Item>
              <Breadcrumb.Item>Platform</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Platform Management
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <SearchInput
              value={search}
              handleChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search for platforms"
            />
            <div className="flex w-full items-center sm:justify-end">
              <AddPlatformModal setData={setData} data={data.data} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <PlatformsTable
                data={data.data}
                getList={getList}
                setData={setData}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        changePage={changePage}
        total={data.total}
        page={currentPage}
      />
    </NavbarSidebarLayout>
  );
};

const DeleteProductModal = ({ id, getList }) => {
  const [isOpen, setOpen] = useState(false);
  const deleteItem = async () => {
    try {
      await Platform.delete(id, localStorage.getItem("userAccount"));
      getList();
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setOpen(false);
    }
  };
  return (
    <>
      <Button color="failure" onClick={() => setOpen(!isOpen)}>
        <HiTrash className="mr-2 text-lg" />
        Delete
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <Modal.Header className="px-3 pb-0 pt-3">
          <span className="sr-only">Delete platform</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-600" />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this platform?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={deleteItem}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

const PlatformsTable = ({ data, setData, getList, isLoading }) => {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell className="p-4">
          <span className="sr-only">Toggle selected</span>
          <Checkbox />
        </Table.HeadCell>
        <Table.HeadCell className="p-4">Title</Table.HeadCell>
        <Table.HeadCell className="p-4">Description</Table.HeadCell>
        <Table.HeadCell className="p-4">Actions</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {isLoading ? (
          <Table.Row>
            <Table.Cell className="p-4" colSpan={6}>
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
              <Table.Cell className="w-4 p-4">
                <Checkbox />
              </Table.Cell>
              <Table.Cell className="p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </div>
              </Table.Cell>
              <Table.Cell className="w-[calc(100%/3)] max-w-[200px] p-4 text-base font-medium text-gray-900 dark:text-white">
                {item.description}
              </Table.Cell>
              <Table.Cell className="space-x-2 whitespace-nowrap p-4">
                <div className="flex items-center gap-x-3">
                  <EditPlatformModal
                    data={item}
                    setData={setData}
                    index={index}
                  />
                  <DeleteProductModal getList={getList} id={item.id} />
                </div>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  );
};

export default PlatformPage;
