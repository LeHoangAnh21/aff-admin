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
            <div
              className="max-w-2xl w-full rounded-lg p-5 m-auto"
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
              }}
            >
              <div className="text-gray-900 dark:text-white">
                <h1 className="mb-10 text-center text-xl font-semibold text-orange-500">
                  {
                    insuranceType.find(
                      (item) => item.value === data.insuranceType
                    )?.title
                  }
                </h1>
                {data.insuranceOrder.image && (
                  <div>
                    <img
                      src={data.insuranceOrder.image}
                      className="max-w-[400px] w-full h-auto mx-auto"
                    />
                  </div>
                )}
                <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                  <div className="opacity-75">Mã đơn hàng</div>
                  <div className="font-medium">{data?.orderCode}</div>
                </div>
                <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                  <div className="opacity-75">Trạng thái đơn</div>
                  <div className={`font-medium`}>
                    {
                      orderStatus.filter(
                        (item) => item.defaultValue === data?.orderStatus
                      )[0]?.label
                    }
                  </div>
                </div>
                <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                  <div className="opacity-75">Trạng thái thanh toán</div>
                  <div
                    className={`${
                      data?.paymentStatus === "REJECTED"
                        ? "text-[#fbd5d5]"
                        : data?.paymentStatus === "PENDING"
                        ? "text-[#fce96a]"
                        : "text-[#bcf0da]"
                    }`}
                  >
                    {data?.paymentStatus === "REJECTED"
                      ? "Đã hủy"
                      : data?.paymentStatus === "PENDING"
                      ? "Đang chờ"
                      : "Thành công"}
                  </div>
                </div>{" "}
                <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                  <div className="opacity-75">Mã đơn hàng</div>
                  <div className="font-medium">{data?.orderCode}</div>
                </div>
                {/* <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                <div className="opacity-75">Nhà bảo hiểm</div>
                <div className="font-medium">Bảo hiểm PVI</div>
              </div> */}
                <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                  <div className="opacity-75">Sản phẩm</div>
                  <div className="font-medium">
                    {
                      insuranceType.filter(
                        (item) => item.value === data?.insuranceType
                      )[0]?.title
                    }
                  </div>
                </div>
                {/* <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                <div className="opacity-75">Thời hạn hợp đồng</div>
                <div className="font-medium">06/12/2024 - 05/12/2025</div>
              </div> */}
                <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                  <div className="opacity-75">Tên khách hàng</div>
                  <div className="font-medium">{data?.fullname}</div>
                </div>
                <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                  <div className="opacity-75">CCCD</div>
                  <div className="font-medium">
                    {data?.insuranceOrder?.identifiCard}
                  </div>
                </div>
                <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                  <div className="opacity-75">Email</div>
                  <div className="font-medium">
                    {data.insuranceOrder?.email}
                  </div>
                </div>
                <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                  <div className="opacity-75">Số điện thoại</div>
                  <div className="font-medium">
                    {data.insuranceOrder?.phoneNumber}
                  </div>
                </div>
                <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                  <div className="opacity-75">Thời gian tạo đơn</div>
                  <div className="font-medium">
                    {new Date(data.createdAt).toLocaleString(
                      "vi-VN",
                      optionDate
                    )}
                  </div>
                </div>
                {(data.insuranceType === "01" ||
                  data.insuranceType === "02") && (
                  <>
                    <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                      <div className="opacity-75">
                        {data.insuranceType === "01"
                          ? "Mục đích sử dụng"
                          : "Loại xe"}
                      </div>
                      <div className="font-medium">
                        {
                          vehicleType[data.insuranceType].find(
                            (item) =>
                              item.value === data.insuranceOrder?.vehicleType
                          )?.label
                        }
                      </div>
                    </div>
                    {!data?.notLicensePlate && (
                      <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                        <div className="opacity-75">Biển số xe</div>
                        <div className="font-medium">
                          {data.insuranceOrder?.licensePlate}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                      <div className="opacity-75">Số khung</div>
                      <div className="font-medium">
                        {data.insuranceOrder?.chassisNumber}
                      </div>
                    </div>
                    <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                      <div className="opacity-75">Số máy</div>
                      <div className="font-medium">
                        {data.insuranceOrder?.engineNumber}
                      </div>
                    </div>
                    <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                      <div className="opacity-75">Chủ xe</div>
                      <div className="font-medium">Nguyễn Văn A</div>
                    </div>
                  </>
                )}
                {data.insuranceType === "03" && (
                  <>
                    <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                      <div className="opacity-75">Quốc gia</div>
                      <div className="text-justify font-medium">
                        {
                          country.find(
                            (item) =>
                              item.value === data.insuranceOrder?.country
                          )?.label
                        }
                      </div>
                    </div>
                    <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                      <div className="opacity-75">Số người tham gia</div>
                      <div className="text-justify font-medium">
                        {data.insuranceOrder?.participantAmount}
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-between border-b-1 border-gray-300 py-[10px] gap-5">
                  <div className="opacity-75">Địa chỉ thường trú</div>
                  <div className="text-justify font-medium">
                    {data.insuranceOrder?.address}
                  </div>
                </div>
                <div className="flex justify-between py-[10px] gap-5">
                  <div className="opacity-75">Phí bảo hiểm</div>
                  <div className="font-medium">
                    {data?.price.toLocaleString("vi-VN")}đ
                  </div>
                </div>
                {data.insuranceLink && (
                  <div className="mt-5">
                    <Link
                      to={data.insuranceLink}
                      className="underline block text-center text-blue-600"
                    >
                      Kết quả bảo hiểm
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </NavbarSidebarLayout>
  );
}
