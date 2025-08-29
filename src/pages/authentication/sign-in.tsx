/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import Account from "@/libs/user/account";
import { userAccount as userAccountStore } from "@/stores/users/account";
import { useAtom } from "jotai";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const SignInPage = () => {
  const [loginField, setLoginField] = useState({
    phoneNumber: "",
    passsword: "",
  });
  const [loading, setLoading] = useState(false);
  const [, setUserAccount] = useAtom(userAccountStore);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const login = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    setErr("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const data = await Account.login(
        loginField.phoneNumber,
        // md5(loginField.passsword)
        loginField.passsword
      );
      const userData = await Account.getUserInfo(data);
      if (userData.role === "user") {
        alert("Không có quyền truy cập");
        return;
      }

      setUserAccount(userData);
      localStorage.setItem("userAccount", data);

      if (searchParams.get("return")) {
        navigate(`${searchParams.get("return")}`);
      } else {
        navigate("/");
      }
      toast.success("Đăng nhập thành công", {
        autoClose: 3000,
      });
    } catch (e: any) {
      console.log(e.message);
      setErr(e.message);
      if (e.message === "401") {
        toast.error("Bạn vui lòng kiểm tra lại thông tin đăng nhập của mình", {
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 lg:h-screen lg:gap-y-12">
      <a href="/" className="my-6 flex items-center gap-x-1 lg:my-0">
        <img
          alt="Flowbite logo"
          src="/images/bh1cham-logo.png"
          className="mr-3 h-10"
        />
        {/* <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
          Easy Insurance
        </span> */}
      </a>
      <Card
        horizontal
        imgSrc="/images/authentication/login.jpg"
        imgAlt=""
        className="w-full md:max-w-[1024px] md:[&>*]:w-full md:[&>*]:p-16 [&>img]:hidden md:[&>img]:w-96 md:[&>img]:p-0 lg:[&>img]:block"
      >
        <h1 className="mb-3 text-2xl font-bold dark:text-white md:text-3xl">
          Đăng nhập
        </h1>
        <form onSubmit={(e) => login(e)}>
          <div className="mb-4 flex flex-col gap-y-3">
            <Label htmlFor="username">Số điện thoại</Label>
            <TextInput
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              disabled={loading}
              value={loginField.phoneNumber}
              onChange={(e) =>
                setLoginField({ ...loginField, phoneNumber: e.target.value })
              }
            />
          </div>
          <div className="mb-6 flex flex-col gap-y-3">
            <Label htmlFor="password">Mật khẩu</Label>
            <TextInput
              id="password"
              name="password"
              type="password"
              disabled={loading}
              value={loginField.passsword}
              onChange={(e) =>
                setLoginField({ ...loginField, passsword: e.target.value })
              }
            />
          </div>
          {/* <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <Checkbox id="rememberMe" name="rememberMe" />
              <Label htmlFor="rememberMe">Remember me</Label>
            </div>
            <a
              href="#"
              className="w-1/2 text-right text-sm text-primary-600 dark:text-primary-300"
            >
              Lost Password?
            </a>
          </div> */}
          <div className="mb-6">
            <Button
              type="submit"
              disabled={loading}
              className="w-full lg:w-auto"
            >
              Đăng nhập
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignInPage;
