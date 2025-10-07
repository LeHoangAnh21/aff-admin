/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Breadcrumb, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import Pagination from "@/components/Pagination";
import Account from "@/libs/user/account";
import { optionDate, optionDateNoTime, ROLE_LABELS } from "@/libs/data";
import { useQuery } from "@tanstack/react-query";
import { userFilter as userFilterStore } from "@/stores/users/account";
import { useAtom } from "jotai";
import Select from "react-select";
import SearchInput from "@/components/SearchInput";
import {toast} from "react-toastify";

const UserPage = () => {
  const [sessionToken, setSessionToken] = useState("");
  const [userFilter, setUserFilter] = useAtom(userFilterStore);

  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ["users", sessionToken, userFilter.roles, userFilter.page, userFilter.phoneNumber],
    queryFn: async () => {
      if (!sessionToken) {
        throw new Error("Vui lòng đăng nhập để sử dụng tính năng này");
      }
      const roles = userFilter.roles.map((item: any) => item.value) || [];

      const res = await Account.list(sessionToken, {
        ...userFilter,
        roles: roles,
        phoneNumber: userFilter.phoneNumber,
      });
      return res;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!sessionToken,
  });

  const changePage = (type: string) => {
    switch (type) {
      case "next":
        if (
          Math.ceil(data.meta.total / userFilter.pageSize) === userFilter.page
        ) {
          break;
        }
        setUserFilter((pre) => ({ ...pre, page: userFilter.page + 1 }));
        break;
      case "back":
        if (userFilter.page === 1) {
          break;
        }
        setUserFilter((pre) => ({ ...pre, page: userFilter.page - 1 }));
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
              <Breadcrumb.Item>Danh sách người dùng</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Danh sách người dùng
            </h1>
          </div>
          <div className="sm:flex ">
            <div className="mb-3 items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <Select
                placeholder={"Chọn vai trò"}
                value={userFilter.roles}
                styles={{
                  multiValueLabel: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.data.color,
                    color: "white",
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
                  setUserFilter((pre) => ({ ...pre, roles: value, page: 1 }));
                }}
                options={ROLE_LABELS}
                isMulti
                className="min-w-[300px]"
              />{" "}
            </div>
            <div className="mb-3 ml-3 w-[30rem] items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <SearchInput
                type="number"
                value={userFilter.phoneNumber}
                onChange={(e: any) => {
                  setUserFilter((pre) => ({ ...pre, phoneNumber: e.target.value.trim(), page: 1 }));
                }}
                placeholder="Tìm kiếm theo SĐT"
                className="inline-block w-full max-w-[300px]"
              />
            </div>
            {/* <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <AddUserModal />
            </div> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllUsersTable data={data?.data || []} isLoading={isFetching} refetch={refetch} />
            </div>
          </div>
        </div>
      </div>
      <Pagination
        changePage={changePage}
        total={data?.meta?.total}
        page={userFilter.page}
        pageSize={userFilter.pageSize}
      />
    </NavbarSidebarLayout>
  );
};

const AllUsersTable = ({ data, isLoading, refetch }) => {
  const [sessionToken, setSessionToken] = useState("");
  const [passwords, setPasswords] = useState<{ [key: string]: string }>({});
  const [role, setRole] = useState<string>('');

  const handlePasswordChange = (userId: string, value: string) => {
    setPasswords(prev => ({ ...prev, [userId]: value }));
  };

  useEffect(() => {
    const storedData = localStorage.getItem("userAccount");

    if (storedData) {
      setSessionToken(localStorage.getItem("userAccount") || "");
    }
  }, []);

  const updatePassword = async (userId: string) => {
    const password = passwords[userId] || '';
    let validRole = ''

    if (!role && !password) {
      toast.error("Không có gì thay đổi!", {
        autoClose: 5000,
      });
      return;
    }

    if (!/^.{6,}$/.test(password) && password) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!", {
        autoClose: 5000,
      });
      return;
    }

    if (role) {
      const validRoles = ['CONSUMER', 'VIP', 'SYSTEM_MANAGER', 'SALES_DIRECTOR', 'SENIOR_SALES_DIRECTOR'];
      const isValid = validRoles.includes(role);

      if(isValid) validRole = role
    }

    try {
      await Account.updatePass(sessionToken, { userId, password, validRole });

      toast.success("Cập nhật thông tin thành công!", {
        autoClose: 5000,
      });
      setPasswords(prev => ({ ...prev, [userId]: '' }));
      setRole('')
      refetch()
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau hoặc báo cho lập trình viên!", {
        autoClose: 5000,
      });
    }
  };

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell className="p-4 text-center">Họ và tên</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Email</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Vai trò</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Số điện thoại
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Căn cước công dân
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Ngày sinh</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">Ngân hàng</Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Số tài khoản
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Tên chủ tài khoản
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Tổng chi tiêu
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          TK hoàn tiền (VNĐ)
        </Table.HeadCell>
        {/*<Table.HeadCell className="p-4 text-center">*/}
        {/*  TK tích lũy (VNĐ)*/}
        {/*</Table.HeadCell>*/}
        <Table.HeadCell className="p-4 text-center">
          TK tiêu dùng (VNĐ)
        </Table.HeadCell>
        {/* <Table.HeadCell className="p-4 text-center">
          TK trách nhiệm (VNĐ)
        </Table.HeadCell> */}
        <Table.HeadCell className="p-4 text-center">
          TK hoàn tiền đang chờ (VNĐ)
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          TK tiêu dùng đang chờ (VNĐ)
        </Table.HeadCell>
        {/* <Table.HeadCell className="p-4 text-center">
          TK trách nhiệm đang chờ (VNĐ)
        </Table.HeadCell> */}
        <Table.HeadCell className="p-4 text-center">
          Người giới thiệu
        </Table.HeadCell>{" "}
        <Table.HeadCell className="p-4 text-center">
          Thời gian gia nhập
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Cập nhật role mới
        </Table.HeadCell>
        <Table.HeadCell className="p-4 text-center">
          Cập nhật mật khẩu
        </Table.HeadCell>
        {/* <Table.HeadCell className="p-4 text-center">Thao tác</Table.HeadCell> */}
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {isLoading ? (
          <Table.Row>
            <Table.Cell className="p-4" colSpan={20}>
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
          data.map((item) => (
            <Table.Row
              key={item.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Table.Cell className="whitespace-nowrap p-4 text-center text-base font-medium text-gray-900 dark:text-white">
                {item.fullname}
              </Table.Cell>
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-medium text-gray-900 dark:text-white">
                {item.email}
              </Table.Cell>
              <Table.Cell
                className={`min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal `}
              >
                <Badge
                  size="sm"
                  className="text-white dark:text-white flex justify-center"
                  style={{
                    background: `${ROLE_LABELS.filter(
                      (role) => role.value === item.roleLabel
                    )[0]?.color}`,
                  }}
                >
                  {
                    ROLE_LABELS.filter(
                      (role) => role.value === item.roleLabel
                    )[0]?.label
                  }
                </Badge>
              </Table.Cell>
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-medium text-gray-900 dark:text-white">
                {item.phoneNumber}
              </Table.Cell>
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {item.identifiCard}
              </Table.Cell>
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {new Date(item.birthday).toLocaleString(
                  "vi-VN",
                  optionDateNoTime
                )}
              </Table.Cell>
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {item.bankName}
              </Table.Cell>
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {item.accNum}
              </Table.Cell>
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {item.accountOwner}
              </Table.Cell>
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {item.totalPurchase}
              </Table.Cell>
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {item.cashbackAccount.toLocaleString("vi-VN")}
              </Table.Cell>
              {/*<Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">*/}
              {/*  {item.accumulatedAccount.toLocaleString("vi-VN")}*/}
              {/*</Table.Cell>*/}
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {item.consumerAccount.toLocaleString("vi-VN")}
              </Table.Cell>
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {item.pendingCashbackAccount.toLocaleString("vi-VN")}
              </Table.Cell>
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {item.pendingConsumerAccount.toLocaleString("vi-VN")}
              </Table.Cell>
              {/* <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {item.pendingLiabilityAccount.toLocaleString("vi-VN")}
              </Table.Cell> */}
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {""}
              </Table.Cell>
              <Table.Cell className="min-w-[150px] whitespace-nowrap p-4 text-center text-base font-normal text-gray-900 dark:text-white">
                {new Date(item.createdAt).toLocaleString("vi-VN", optionDate)}
              </Table.Cell>
              <Table.Cell className="min-w-[250px] p-4">
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  value={role} onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Chọn vai trò</option>
                  <option value="CONSUMER">Consumer</option>
                  <option value="VIP">VIP</option>
                  <option value="SYSTEM_MANAGER">System Manager</option>
                  <option value="SALES_DIRECTOR">Sales Director</option>
                  <option value="SENIOR_SALES_DIRECTOR">Senior Sales Director</option>
                </select>
              </Table.Cell>
              <Table.Cell className="p-4">
                <div className="flex justify-center items-center gap-x-3 whitespace-nowrap">
                  <div className="mb-3 ml-3 w-[20rem] items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
                    <SearchInput
                      type="text"
                      placeholder="Nhập mật khẩu mới"
                      value={passwords[item.id] || ''}
                      onChange={(e: any) => handlePasswordChange(item.id, e.target.value)}
                      className="inline-block w-full"
                    />
                  </div>
                  <div
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => updatePassword(item.id)}
                  >
                    Cập nhật
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  );
};

export default UserPage;
