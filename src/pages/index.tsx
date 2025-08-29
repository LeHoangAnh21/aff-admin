/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Badge,
  Button,
  Dropdown,
  Spinner,
  Table,
  useTheme,
} from "flowbite-react";
import { useEffect, useState, memo, useCallback } from "react";
import Chart from "react-apexcharts";
import "svgmap/dist/svgMap.min.css";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";
import ReactDatePicker from "@/components/DatePicker";
import Statistic from "@/libs/user/statistic";
import { userAccount as userAccountStore } from "@/stores/users/account";
import { useAtom } from "jotai";
import Order from "@/libs/user/order";
import Pagination from "@/components/Pagination";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";

const period = [
  {
    title: "Tuần này",
    value: "THIS_WEEK",
  },
  {
    title: "Tuần trước",
    value: "LAST_WEEK",
  },
  {
    title: "Tháng này",
    value: "THIS_MONTH",
  },
  {
    title: "Tháng trước",
    value: "LAST_MONTH",
  },
  {
    title: "Năm này",
    value: "THIS_YEAR",
  },
  {
    title: "Năm trước",
    value: "LAST_YEAR",
  },
];

const DashboardPage = () => {
  const [date, setDate] = useState("THIS_WEEK");
  const [sessionToken, setSessionToken] = useState(
    localStorage.getItem("userAccount")
  );

  const {
    data: revenue,
    isPending: revenueIsPending,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["revenue", sessionToken, date],
    queryFn: async () => {
      if (!sessionToken) {
        throw new Error("Vui lòng đăng nhập để sử dụng tính năng này");
      }
      const { data } = await Statistic.getRevenue(date, sessionToken);

      return data;
    },

    staleTime: 1000 * 60 * 5,
    enabled: !!sessionToken,
  });

  const { data: system } = useQuery({
    queryKey: ["system", sessionToken],
    queryFn: async () => {
      if (!sessionToken) {
        throw new Error("Vui lòng đăng nhập để sử dụng tính năng này");
      }
      const { data } = await Statistic.getStatisticSystem(sessionToken);
      return data;
    },

    staleTime: 1000 * 60 * 5,
    enabled: !!sessionToken,
  });

  return (
    <NavbarSidebarLayout>
      <div className="px-4 py-6 space-y-5">
        <StatisticInfor data={system} />
        <SalesThisWeek
          revenue={revenue}
          isPending={revenueIsPending}
          date={date}
          setDate={setDate}
        />
        {/* <div className="flex justify-between flex-wrap gap-5">
          <h1 className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
            Dashboard
          </h1>
          <div className="flex items-center gap-5 flex-wrap">
            <DatePicker date={date.timeRange} setDate={setDate} />

            {date.timeRange === "custom" && (
              <div className="flex gap-3 items-center">
                <ReactDatePicker
                  date={date.startDate}
                  handleChangeDate={(e) => {
                    if (date.endDate < e) {
                      setDate((pre) => ({ ...pre, startDate: e }));
                      setDate((pre) => ({ ...pre, endDate: e }));

                      return;
                    }
                    setDate((pre) => ({ ...pre, startDate: e }));
                  }}
                />
                <span className="text-gray-900 dark:text-white">to</span>
                <ReactDatePicker
                  date={date.endDate}
                  handleChangeDate={(e) => {
                    if (date.startDate > e) {
                      setDate((pre) => ({ ...pre, startDate: e }));
                      setDate((pre) => ({ ...pre, endDate: e }));

                      return;
                    }
                    setDate((pre) => ({ ...pre, endDate: e }));
                  }}
                />
                <Button onClick={getData}>Áp dụng</Button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="max-w-[22rem] flex justify-between p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Doanh thu
              </h5>
              <p className="mb-3 text-2xl font-normal text-gray-700 dark:text-white">
                {revenue.totalRevenue.toLocaleString("vi-VN")}VNĐ
              </p>
            </div>
            <div
              className={`ml-5 flex items-center text-base font-bold ${
                revenue.revenueChangePercentage < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              } `}
            >
              {revenue.revenueChangePercentage}%
              {revenue.revenueChangePercentage > 0 ? (
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Revenue data={revenue} />
          <ProfileView data={profileView} />
          {userAccount.role === "ADMIN" && <NewbieCount data={newbieCount} />}
        </div> */}
        {/* <Transactions
          data={orderData}
          isLoading={isLoading}
          currentPage={currentPage}
          handlePageChange={changePage}
        /> */}
      </div>
    </NavbarSidebarLayout>
  );
};

const StatisticInfor = ({ data }: any) => {
  return (
    <div className="space-y-5">
      <div className="space-y-3 text-gray-600 dark:text-white">
        <div>
          <h1 className="font-semibold text-xl">Thống kê hệ thống</h1>
        </div>
        <div className="inline-block">
          <div className="flex gap-5 flex-wrap">
            <div className="py-5 px-6 space-y-3 bg-white shadow dark:bg-gray-800 rounded-lg">
              <h2 className="text-sm">Tổng doanh thu</h2>
              <span className="block font-medium text-xl">
                {data?.totalRevenue.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="py-5 px-6 space-y-3 bg-white shadow dark:bg-gray-800 rounded-lg">
              <h2 className="text-sm">Tổng thuế</h2>
              <span className="block font-medium text-xl">
                {data?.totalTax.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="py-5 px-6 space-y-3 bg-white shadow dark:bg-gray-800 rounded-lg">
              <h2 className="text-sm">Tổng chi hệ thống</h2>
              <span className="block font-medium text-xl">
                {data?.totalOutcome.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 text-gray-600 dark:text-white">
        <div>
          <h1 className="font-semibold text-xl">Tổng tiền các ví hệ thống</h1>
        </div>
        <div className="inline-block">
          <div className="flex gap-5 flex-wrap">
            <div className="py-5 px-6 space-y-3 max-w-[200px] bg-white shadow dark:bg-gray-800 rounded-lg">
              <h2 className="text-sm">Ví hoàn tiền toàn hệ thống</h2>
              <span className="block font-medium text-xl">
                {data?.totalCashbackAccount.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="py-5 px-6 space-y-3 max-w-[200px] bg-white shadow dark:bg-gray-800 rounded-lg">
              <h2 className="text-sm">Ví chi tiêu toàn hệ thống</h2>
              <span className="block font-medium text-xl">
                {data?.totalConsumerAccount.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="py-5 px-6 space-y-3 max-w-[200px] bg-white shadow dark:bg-gray-800 rounded-lg">
              <h2 className="text-sm">Ví điểm thường toàn hệ thống</h2>
              <span className="block font-medium text-xl">
                {data?.totalPoint.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="py-5 px-6 space-y-3 max-w-[200px] bg-white shadow dark:bg-gray-800 rounded-lg">
              <h2 className="text-sm">Ví chờ hoàn tiền toàn hệ thống</h2>
              <span className="block font-medium text-xl">
                {data?.totalPendingCashbackAccount.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="py-5 px-6 space-y-3 max-w-[200px] bg-white shadow dark:bg-gray-800 rounded-lg">
              <h2 className="text-sm">Ví chờ chi tiêu toàn hệ thống</h2>
              <span className="block font-medium text-xl">
                {data?.totalPendingConsumerAccount.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 text-gray-600 dark:text-white">
        <div>
          <h1 className="font-semibold text-xl">Yêu cầu rút tiền</h1>
        </div>
        <div className="inline-block">
          <div className="flex gap-5 flex-wrap">
            <div className="py-5 px-6 space-y-3 bg-white shadow dark:bg-gray-800 rounded-lg">
              <h2 className="text-sm">Yêu cầu rút tiền chưa xử lý</h2>
              <span className="block font-medium text-xl">
                {data?.withdrawalCount}
              </span>
            </div>
            <div className="py-5 px-6 space-y-3 bg-white shadow dark:bg-gray-800 rounded-lg">
              <h2 className="text-sm">Số tiền chờ rút</h2>
              <span className="block font-medium text-xl">
                {data?.withdrawalTotalAmount.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SalesThisWeek = ({
  revenue = {
    data: [],
    percentageChange: 0,
  },
  date,
  setDate,
  isPending,
}: any) => {
  const { data, percentageChange } = revenue;

  return (
    <div className="rounded-lg bg-white p-4 space-y-8 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="space-y-2 flex flex-col">
        <div className="inline-block self-end">
          <DatePicker date={date} setDate={setDate} />
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="shrink-0">
            <h3 className="text-xl font-medium text-gray-600 dark:text-white">
              Biểu đồ doanh số
            </h3>
          </div>
          <div
            className={`flex flex-1 items-center justify-end text-base font-bold ${
              percentageChange > 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {percentageChange}%
            <svg
              className={`h-5 w-5 ${
                percentageChange > 0 ? "rotate-0" : "rotate-180"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
      {isPending ? (
        <div className="min-h-[420px] flex">
          <div className="loader m-auto"></div>
        </div>
      ) : (
        <SalesChart data={data} />
      )}
    </div>
  );
};

const SalesChart = ({ data = [] }: any) => {
  const { mode } = useTheme();
  const isDarkTheme = mode === "dark";

  const borderColor = isDarkTheme ? "#374151" : "#F3F4F6";
  const labelColor = isDarkTheme ? "#93ACAF" : "#6B7280";
  const opacityFrom = isDarkTheme ? 0 : 0.45;
  const opacityTo = isDarkTheme ? 0.15 : 0;

  const date = data.map((item: any) => (item.month ? item.month : item.date));
  const revenue = data.map((item: any) => item.amount);

  const options: ApexCharts.ApexOptions = {
    stroke: {
      curve: "smooth",
    },
    chart: {
      type: "area",
      fontFamily: "Inter, sans-serif",
      foreColor: labelColor,
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom,
        opacityTo,
        type: "vertical",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
    grid: {
      show: true,
      borderColor: borderColor,
      strokeDashArray: 1,
      padding: {
        left: 35,
        bottom: 15,
      },
    },
    markers: {
      size: 5,
      strokeColors: "#ffffff",
      hover: {
        size: undefined,
        sizeOffset: 3,
      },
    },
    xaxis: {
      categories: [...date],
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      axisBorder: {
        color: borderColor,
      },
      axisTicks: {
        color: borderColor,
      },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 10,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
        formatter: function (value) {
          return value.toLocaleString("vi-VN");
        },
      },
    },
    legend: {
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: [labelColor],
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          xaxis: {
            labels: {
              show: false,
            },
          },
        },
      },
    ],
  };
  const series = [
    {
      name: "Doanh thu (VNĐ)",
      data: [...revenue],
      color: "#1A56DB",
    },
    // {
    //   name: "Revenue (previous period)",
    //   data: [6556, 6725, 6424, 6356, 6586, 6756, 6616],
    //   color: "#FDBA8C",
    // },
  ];

  return <Chart height={420} options={options} series={series} type="area" />;
};

const DatePicker = ({ date, setDate }: any) => {
  return (
    <span className="text-sm text-gray-600 dark:text-white">
      <Dropdown
        inline
        label={period.find((item) => item.value === date)?.title}
        className="z-[12] overflow-hidden"
      >
        {period.map((item) => (
          <Dropdown.Item key={item.value} onClick={() => setDate(item.value)}>
            {item.title}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </span>
  );
};

const Transactions = ({
  data,
  isLoading,
  currentPage,
  handlePageChange,
}: any) => {
  return (
    <div className="my-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Lịch sử đơn hàng
          </h3>
          <span className="text-base font-normal text-gray-600 dark:text-gray-400">
            Dưới đây là danh sách lịch sử đơn hàng đã bán
          </span>
        </div>
        {/* <div className="shrink-0">
          <a
            href="#"
            className="rounded-lg p-2 text-sm font-medium text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700"
          >
            View all
          </a>
        </div> */}
      </div>
      <div className="mt-8 flex flex-col">
        <div className="overflow-x-auto rounded-lg">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <Table
                striped
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-600"
              >
                <Table.Head className="bg-gray-50 dark:bg-gray-700">
                  <Table.HeadCell>Mã đơn hàng</Table.HeadCell>
                  <Table.HeadCell>Tên sản phẩm</Table.HeadCell>
                  <Table.HeadCell>Thời gian</Table.HeadCell>
                  <Table.HeadCell>Giá</Table.HeadCell>
                  <Table.HeadCell>Người mua hàng</Table.HeadCell>
                </Table.Head>
                <Table.Body className="bg-white dark:bg-gray-800">
                  {isLoading ? (
                    <Table.Row>
                      <Table.Cell className="p-4" colSpan={6}>
                        <div
                          role="status"
                          className="w-full flex justify-center"
                        >
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
                      {data.data.map((item: any) => (
                        <Table.Row key={item.id}>
                          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                            {item.order.order_code}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                            {item.product.title}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                            {/* {new Date(item.created_at).toLocaleString(
                              "en-GB",
                              optionDate
                            )} */}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                            {item.order.amount.toLocaleString("vi-VN")}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                            {item.relatedUser.username}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </>
                  )}

                  {/* <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment refund to{" "}
                      <span className="font-semibold">#00910</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 23, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      -$670
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment failed from{" "}
                      <span className="font-semibold">#087651</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 18, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $234
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="failure">Cancelled</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">Lana Byrd</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 15, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $5000
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <span className="mr-2 rounded-md bg-purple-100 py-0.5 px-2.5 text-xs font-medium text-purple-800 dark:bg-purple-200">
                        In progress
                      </span>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">Jese Leos</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 15, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $2300
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">THEMESBERG LLC</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 11, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $560
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">Lana Lysle</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 6, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $1437
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment to{" "}
                      <span className="font-semibold">Joseph Mcfall</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Apr 1, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $980
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">Alphabet LLC</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Mar 23, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $11,436
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <span className="mr-2 rounded-md bg-purple-100 py-0.5 px-2.5 text-xs font-medium text-purple-800 dark:bg-purple-200">
                        In progress
                      </span>
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-900 dark:text-white">
                      Payment from{" "}
                      <span className="font-semibold">Bonnie Green</span>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Mar 23, 2021
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap p-4 text-sm font-semibold text-gray-900 dark:text-white">
                      $560
                    </Table.Cell>
                    <Table.Cell className="flex whitespace-nowrap p-4">
                      <Badge color="success">Completed</Badge>
                    </Table.Cell>
                  </Table.Row> */}
                </Table.Body>
              </Table>
            </div>
            <Pagination
              changePage={handlePageChange}
              total={data.total}
              page={currentPage}
            />
          </div>
        </div>
      </div>
      {/* <div className="flex items-center justify-between pt-3 sm:pt-6">
        <Datepicker />
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Transactions Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div> */}
    </div>
  );
};

export default memo(DashboardPage);
