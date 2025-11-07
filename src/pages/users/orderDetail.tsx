import SearchInput from "@/components/SearchInput";
import NavbarSidebarLayout from "@/layouts/navbar-sidebar";
import {
  country,
  insuranceType,
  optionDate,
  orderStatus,
  vehicleType,
} from "@/libs/data";
import Order from "@/libs/user/order";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiHome } from "react-icons/hi";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CarOrderDetail from "@/pages/users/OrderDetailUI/CarOrderDetail";
import MotorOrderDetail from "@/pages/users/OrderDetailUI/MotorOrderDetail";
import TravelOrderDetail from "@/pages/users/OrderDetailUI/TravelOrderDetail";
import HealthOrderDetail from "@/pages/users/OrderDetailUI/HealthOrderDetail";
import BodyShellOrderDetail from "@/pages/users/OrderDetailUI/BodyShellOrderDetail";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [sessionToken, setSessionToken] = useState("");
  const [linkInsurance, setLinkInsurance] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data, error, isFetching, isPending, isRefetching } = useQuery<any>({
    queryKey: ["orders", sessionToken, orderId],
    queryFn: async () => {
      if (!sessionToken) {
        throw new Error("Vui lòng đăng nhập để sử dụng tính năng này");
      }
      const res = await Order.getOrderDetail(
        orderId,
        localStorage.getItem("userAccount")
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!sessionToken,
  });

  const handleUpdateLink = async () => {
    if (!linkInsurance) {
      toast.error("Không được để trống đường dẫn!", {
        autoClose: 5000,
      });
    }
    try {
      setIsLoading(true);
      const res = await Order.linkInsurance(
        data.id,
        { insuranceLink: linkInsurance },
        sessionToken
      );
      toast.success("Cập nhật link bảo hiểm cho khách hàng thành công!", {
        autoClose: 5000,
      });
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message, {
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
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

  const renderOrderDetailUi = (data: any) => {
    switch (data.insuranceType) {
      case '01':
        return <CarOrderDetail data={data} />
      case '02':
        return <MotorOrderDetail data={data} />
      case '03':
        return <TravelOrderDetail data={data} />
      case '04':
        return <HealthOrderDetail data={data} />
      case '06':
        return <BodyShellOrderDetail data={data} />
      default:
        return <div></div>;
    }
  }

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="bg-white dark:bg-gray-800 min-h-[calc(100vh-64px)] flex flex-col">
        <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
          <div className="w-full">
            <div>
              <Breadcrumb>
                <Breadcrumb.Item href="#">
                  <div className="flex items-center gap-x-3">
                    <HiHome className="text-xl" />
                    <span className="dark:text-white">Trang chủ</span>
                  </div>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Người dùng</Breadcrumb.Item>
                <Breadcrumb.Item href="/users/order">Đơn hàng</Breadcrumb.Item>
                <Breadcrumb.Item>Thông tin đơn hàng</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        </div>
        <div className="sm:flex flex-col p-5 border border-gray-200  dark:border-gray-700">
          <h1 className="dark:text-gray-200 text-gray-600 text-2xl font-medium mb-4">
            Thông tin chi tiết đơn hàng
          </h1>
          <div className="mb-3 dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 flex gap-1 flex-wrap items-center">
            {data?.paymentStatus === "SUCCESS" ? (
              <>
                <SearchInput
                  value={linkInsurance}
                  onChange={(e) => setLinkInsurance(e.target.value)}
                  id="link"
                  placeholder="Link bảo hiểm cho khách hàng"
                  className="min-w-[300px]"
                />
                <Button
                  onClick={handleUpdateLink}
                  disabled={
                    data?.orderStatus === "COMPLETE" ||
                    data?.orderStatus === "CANCELLED" ||
                    data?.orderStatus === "REJECTED" ||
                    isLoading
                  }
                >
                  Cập nhật
                </Button>
              </>
            ) : null}
          </div>
        </div>
        {isPending ? (
          <div className="flex-1 flex items-center justify-center">
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
            </div>
          </div>
        ) : (
          <div className="flex-1 flex py-10">
            {renderOrderDetailUi(data)}
          </div>
        )}
      </div>
    </NavbarSidebarLayout>
  );
}
