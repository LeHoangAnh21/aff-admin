import {country, insuranceType, optionDate, optionDateNoTime, orderStatus, vehicleType} from "@/libs/data";
import {Link} from "react-router-dom";
import {InfoSection} from "@/pages/users/OrderDetailUI/template";

export default function BodyShellOrderDetail ({ data }: { data: any }) {

  const buyerInfo = [
    { label: 'Tên người mua', value: data.insuranceOrder?.fullName },
    { label: 'Địa chỉ', value: data.insuranceOrder?.address },
    { label: 'Số điện thoại', value: data.insuranceOrder?.phoneNumber },
    { label: 'Email', value: data.insuranceOrder?.email },
  ];

  const carInfo = [
    { label: 'Biển kiểm soát', value: data.insuranceOrder?.licensePlate },
    { label: 'Số khung', value: data.insuranceOrder?.chassisNumber },
    { label: 'Số máy', value: data.insuranceOrder?.engineNumber },
    { label: 'Hãng xe', value: data.insuranceOrder?.carCompany },
    { label: 'Hiệu xe', value: data.insuranceOrder?.vehicleModel },
    { label: 'Loại xe', value: data.insuranceOrder?.vehicleType },
    { label: 'Năm sản xuất', value: data.insuranceOrder?.yearOfManufacture },
    { label: 'Số chỗ ngồi', value: data.insuranceOrder?.numberOfSeat },
    { label: 'Mục đích sử dụng', value: `${data.insuranceOrder?.isBusinessVehicle ? 'Xe kinh doanh' : 'Xe không kinh doanh'}` },
  ]

  const insuranceInfo = [
    {
      label: 'Ngày bắt đầu',
      value: data.insuranceOrder?.startDate
        ? new Date(data.insuranceOrder.startDate).toLocaleString('vi-VN', optionDateNoTime)
        : '-'
    },
    {
      label: 'Ngày kết thúc',
      value: data.insuranceOrder?.endDate
        ? new Date(data.insuranceOrder.endDate).toLocaleString('vi-VN', optionDateNoTime)
        : '-'
    },
    { label: 'Thời hạn', value: `${data.insuranceOrder?.duration} năm` },
  ];

  return (
    <div
      className="max-w-2xl w-full rounded-lg p-5 m-auto"
      style={{
        boxShadow:
          "rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset",
      }}
    >
      <div className="text-gray-900 dark:text-white">
        <h1 className="mb-10 text-center text-xl font-semibold text-orange-500">
          Bảo hiểm du lịch
        </h1>
        {data.insuranceOrder.image && (
          <div>
            <img
              src={data.insuranceOrder.image}
              className="max-w-[400px] w-full h-auto mx-auto"
            />
          </div>
        )}

        <InfoSection title="Thông tin đơn hàng" data={buyerInfo} />
        <InfoSection title="Thông tin người mua" data={buyerInfo} />
        <InfoSection title="Thông tin xe" data={carInfo} />
        <InfoSection title="Thông tin bảo hiểm" data={insuranceInfo} />

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
  )
}
