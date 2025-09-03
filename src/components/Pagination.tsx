import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Pagination = ({ changePage, total, page, pageSize = 10 }: any) => {
  return (
    <div className="sticky bottom-0 right-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
      <div className="mb-4 flex items-center sm:mb-0">
        <div
          onClick={() => changePage("back")}
          className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Previous page</span>
          <HiChevronLeft className="text-2xl" />
        </div>
        <div
          onClick={() => changePage("next")}
          className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Next page</span>
          <HiChevronRight className="text-2xl" />
        </div>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Hiển thị&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {page === 1 ? 1 : (page - 1) * pageSize} -{" "}
            {pageSize * page > total ? total : pageSize * page}
          </span>
          &nbsp; trong tổng số&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            {total}
          </span>{" "}
          mục
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <div
          onClick={() => changePage("back")}
          className="inline-flex cursor-pointer flex-1 items-center justify-center rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <HiChevronLeft className="mr-1 text-base" />
          Trước
        </div>
        <div
          onClick={() => changePage("next")}
          className="inline-flex cursor-pointer flex-1 items-center justify-center rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Sau
          <HiChevronRight className="ml-1 text-base" />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
