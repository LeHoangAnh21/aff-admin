import {country, insuranceType, optionDate, optionDateNoTime, orderStatus, vehicleType} from "@/libs/data";
import {Link} from "react-router-dom";
import {InfoSection} from "@/pages/users/OrderDetailUI/template";

export const CarTypeList = [
  { value: '01', label: 'Xe con chở người dưới 9 chỗ' },
  { value: '02', label: 'Xe con chở người 9 chỗ' },
  { value: '03', label: 'Xe con chở người trên 9 chỗ' },
  { value: '04', label: 'Xe Taxi công nghệ' },
  { value: '05', label: 'Xe taxi' },
  { value: '06', label: 'Xe pickup' },
  { value: '07', label: 'Xe tải dưới 3 tấn' },
  { value: '08', label: 'Xe tải từ 3 tấn đến 8 tấn' },
  { value: '09', label: 'Xe tải từ 8 tấn đến 10 tấn' },
  { value: '10', label: 'Xe tải từ 10 tấn đến 15 tấn' },
  { value: '11', label: 'Xe tải trên 15 tấn' },
  { value: '12', label: 'Xe đầu kéo' },
  { value: '13', label: 'Xe đông lạnh nhỏ hơn hoặc bằng 3,5 tấn' },
  { value: '14', label: 'Xe đông lạnh trên 3,5 tấn' },
  { value: '15', label: 'Xe romooc ben (Tự đổ)' },
  { value: '16', label: 'Romooc' },
  { value: '17', label: 'Xe bảo ôn đến 3,5 tắn' },
  { value: '18', label: 'Xe bảo ổn 3,5 tấn' },
  { value: '19', label: 'Xe van' },
  { value: '20', label: 'Xe bus nội tỉnh' },
  { value: '21', label: 'Xe bus liên tỉnh' },
  { value: '22', label: 'Xe khách liên tỉnh' },
] as const;

export const CarIntendedUseConst = {
  BUSINESS: '01',
  PERSONAL: '02',
} as const;

export const CarIntendedUse = [
  { value: CarIntendedUseConst.BUSINESS, label: 'Xe kinh doanh' },
  { value: CarIntendedUseConst.PERSONAL, label: 'Xe không kinh doanh' },
] as const;

export default function BodyShellOrderDetail ({ data }: { data: any }) {

  const buyerInfo = [
    { label: 'Tên người mua', value: data.insuranceOrder?.fullName },
    { label: 'Địa chỉ', value: data.insuranceOrder?.address },
    { label: 'Số điện thoại', value: data.insuranceOrder?.phoneNumber },
    { label: 'Email', value: data.insuranceOrder?.email },
  ];

  const carInfo = [
    { label: 'Biển kiểm soát', value: data.insuranceOrder?.licensePlate || 'Chưa có' },
    { label: 'Số khung', value: data.insuranceOrder?.chassisNumber },
    { label: 'Số máy', value: data.insuranceOrder?.engineNumber },
    { label: 'Hãng xe', value: data.insuranceOrder?.carCompany },
    { label: 'Hiệu xe', value: data.insuranceOrder?.vehicleModel },
    { label: 'Giá xe khai báo', value: `₫${data.insuranceOrder?.carPrice.toLocaleString('vi-VN')}` },
    { label: 'Loại xe', value: CarTypeList.find(item => item.value === data.insuranceOrder?.vehicleType)?.label || '' },
    { label: 'Năm sản xuất', value: data.insuranceOrder?.yearOfManufacture },
    { label: 'Số chỗ ngồi', value: data.insuranceOrder?.numberOfSeat + ' Chỗ' },
    { label: 'Mục đích sử dụng', value: CarIntendedUse.find(item => item.value === data.insuranceOrder?.intendedUse)?.label || '' },
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
          Bảo hiểm thân vỏ
        </h1>
        {data.insuranceOrder.registrationImage && (
          <div>
            <img
              src={data.insuranceOrder.registrationImage}
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
