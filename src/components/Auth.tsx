import { useAtom } from "jotai";
import { userAccount as userAccountStore } from "@/stores/users/account";
import { coverLoading as coverLoadingStore } from "@/stores/cover";
import React, { useEffect } from "react";
import Account from "@/libs/user/account";
import { useLocation, useNavigate, Outlet, Navigate } from "react-router-dom";

export default function Auth() {
  const [userAccount, setUserAccount] = useAtom(userAccountStore);
  const [coverLoading, setCoverLoading] = useAtom(coverLoadingStore);
  let location = useLocation();
  const navigate = useNavigate();

  const authentication = async () => {
    setCoverLoading({
      show: true,
      message: "Authentication...",
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const rs = await Account.getUserInfo(localStorage.getItem("userAccount"));
      if (rs.role === "user") {
        alert("Không có quyền truy cập");
        return;
      }
      setUserAccount(rs);
      setCoverLoading({
        show: false,
        message: "",
      });
    } catch (e) {
      setCoverLoading({
        show: false,
        message: "",
      });
      navigate(`/login?return=${location.pathname}`);
    }
  };

  useEffect(() => {
    if (
      localStorage.getItem("userAccount") &&
      Object.keys(userAccount).length !== 0
    ) {
      return;
    }

    authentication();
  }, []);

  return (
    <React.Fragment>
      {/* {coverLoading.show ? (
        <div
          className={
            "d-flex align-items-center justify-content-center text-center user-select-none"
          }
          style={{ height: "100vh" }}
        >
          <div>
            <div
              className="spinner-border"
              //   size="xl"
              color="primary"
              role="status"
              style={{ width: "50px", height: "50px" }}
            ></div>
            <h5 className={"pt-3 text-center"}>{coverLoading.message}</h5>
          </div>
        </div>
      ) : (
        <>
          {!localStorage.getItem("userAccount") ||
          localStorage.getItem("userAccount") === "" ? (
            <Navigate to={`/login?return=${location.pathname}`} />
          ) : (
            <Outlet />
          )}
        </>
      )} */}
      <>
        {!localStorage.getItem("userAccount") ||
        localStorage.getItem("userAccount") === "" ? (
          <Navigate to={`/login?return=${location.pathname}`} />
        ) : (
          <Outlet />
        )}
      </>
    </React.Fragment>
  );
}
