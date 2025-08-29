/* eslint-disable jsx-a11y/anchor-is-valid */
import type { FC } from "react";
import {
  Avatar,
  DarkThemeToggle,
  Dropdown,
  Label,
  Navbar,
  TextInput,
} from "flowbite-react";
import {
  HiArchive,
  HiBell,
  HiCog,
  HiCurrencyDollar,
  HiEye,
  HiInbox,
  HiLogout,
  HiMenuAlt1,
  HiOutlineTicket,
  HiSearch,
  HiShoppingBag,
  HiUserCircle,
  HiUsers,
  HiViewGrid,
  HiX,
} from "react-icons/hi";
import { useSidebarContext } from "../context/SidebarContext";
import isSmallScreen from "../helpers/is-small-screen";
import { useAtom } from "jotai";
import { userAccount as userAccountStore } from "@/stores/users/account";
import { useNavigate } from "react-router";

const ExampleNavbar: FC = function () {
  const { isOpenOnSmallScreens, isPageWithSidebar, setOpenOnSmallScreens } =
    useSidebarContext();
  const [userAccount, setUserAccount] = useAtom(userAccountStore);
  const navigate = useNavigate();

  const signOut = () => {
    setUserAccount({});
    localStorage.removeItem("userAccount");
    navigate("/login");
  };
  return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isPageWithSidebar && (
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline"
              >
                <span className="sr-only">Toggle sidebar</span>
                {isOpenOnSmallScreens && isSmallScreen() ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </button>
            )}
            <Navbar.Brand href="/">
              <img
                alt="logo"
                src="/images/bh1cham-logo.png"
                className="mr-3 h-6 sm:h-8"
              />
            </Navbar.Brand>
            {/* <form className="ml-16 hidden md:block">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <TextInput
                icon={HiSearch}
                id="search"
                name="search"
                placeholder="Search"
                required
                size={32}
                type="search"
              />
            </form> */}
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <button
                onClick={() => setOpenOnSmallScreens(!isOpenOnSmallScreens)}
                className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden"
              >
                <span className="sr-only">Search</span>
                <HiSearch className="h-6 w-6" />
              </button>
              {/* <NotificationBellDropdown />
              <AppDrawerDropdown /> */}

              <DarkThemeToggle />
            </div>

            <div className="">
              <UserDropdown
                userAccount={userAccount}
                setUserAccount={setUserAccount}
                signOut={signOut}
              />
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

const UserDropdown = ({ userAccount, setUserAccount, signOut }: any) => {
  return (
    <>
      {Object.keys(userAccount).length !== 0 && (
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <span>
              <span className="sr-only">User menu</span>
              <Avatar
                alt=""
                img="../images/bh1cham-icon.png"
                rounded
                size="sm"
              />
            </span>
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{userAccount.fullname}</span>
            {/* <span className="block truncate text-sm font-medium">
              {userAccount.email}
            </span> */}
          </Dropdown.Header>
          {/* <Dropdown.Item>Dashboard</Dropdown.Item>
      <Dropdown.Item>Settings</Dropdown.Item>
      <Dropdown.Item>Earnings</Dropdown.Item> */}
          {/* <Dropdown.Divider /> */}
          <Dropdown.Item className="rounded-b-xl" onClick={signOut}>
            Đăng xuất
          </Dropdown.Item>
        </Dropdown>
      )}
    </>
  );
};

export default ExampleNavbar;
