/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb, Button, Card, Label, TextInput } from "flowbite-react";

import { HiCloudUpload, HiHome } from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { useParams } from "react-router";
import Account from "@/libs/user/account";
import { useState } from "react";

const UserDetailPage = () => {
  const { id } = useParams();
  const [editData, setEditData] = useState({
    fullname: "",
    email: "",
    phone_number: "",
    role: "",
  });
  // const getDetail = async = () => {
  //   const data = await Account.
  // }

  return (
    <NavbarSidebarLayout>
      <>
        <div className="grid grid-cols-1 gap-y-6 px-4 pt-6 dark:bg-gray-900 xl:gap-4">
          <div className="col-span-full">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/users/list">Users</Breadcrumb.Item>
              <Breadcrumb.Item>User Detail</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              User Details
            </h1>
          </div>
          <div className="flex flex-col gap-[20px]">
            <UserProfileCard />
            <GeneralInformationCard />
            <BalanceInformationCard />
          </div>
          <div></div>
        </div>
        <div className="grid grid-cols-1 gap-y-6 px-4 pt-4 xl:grid-cols-2 xl:gap-4"></div>
      </>
    </NavbarSidebarLayout>
  );
};

const UserProfileCard = () => {
  return (
    <Card>
      <div className="items-center sm:flex sm:space-x-4 xl:block xl:space-x-0 2xl:flex 2xl:space-x-4">
        <img
          alt=""
          src="../../images/users/jese-leos-2x.png"
          className="mb-4 h-28 w-28 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
        />
        <div>
          <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
            Jese Leos
          </h3>
          <div className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
            Software Engineer
          </div>
          <a
            href="#"
            className="inline-flex items-center rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            <HiCloudUpload className="mr-2" />
            Change picture
          </a>
        </div>
      </div>
    </Card>
  );
};

const GeneralInformationCard = () => {
  return (
    <Card>
      <h3 className="mb-4 text-xl font-bold dark:text-white">
        General information
      </h3>
      <form action="#">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
            <Label htmlFor="fullName">Full name</Label>
            <TextInput id="fullName" name="fullName" required />
          </div>

          <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
            <Label htmlFor="username">Username</Label>
            <TextInput id="username" name="username" disabled required />
          </div>
          <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
            <Label htmlFor="email">Email</Label>
            <TextInput id="email" name="email" type="email" required />
          </div>
          <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
            <Label htmlFor="phone-number">Phone Number</Label>
            <TextInput
              id="phone-number"
              name="phone-number"
              required
              type="tel"
            />
          </div>
          <div className="col-span-6 grid grid-cols-1 gap-y-2 sm:col-span-3">
            <Label htmlFor="role">Role</Label>
            <TextInput id="role" name="role" required />
          </div>
          <div className="col-span-6">
            <Button color="primary">Save all</Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

const BalanceInformationCard = () => {
  return (
    <Card>
      <h3 className="mb-4 text-xl font-bold dark:text-white">
        Balance information
      </h3>
      <div className="grid grid-cols-6 gap-6">
        <div className="grid col-span-6 grid-cols-1 gap-y-2 sm:col-span-3">
          <Label htmlFor="balance">Balance information</Label>
          <TextInput id="balance" name="balance" type="text" />
        </div>
        <div className="col-span-6">
          <Button color="primary">Save all</Button>
        </div>
      </div>
    </Card>
  );
};

export default UserDetailPage;
