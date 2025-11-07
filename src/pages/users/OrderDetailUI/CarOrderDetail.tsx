import {country, insuranceType, optionDate, optionDateNoTime, orderStatus, vehicleType} from "@/libs/data";
import {Link} from "react-router-dom";
import {InfoSection} from "@/pages/users/OrderDetailUI/template";

export default function CarOrderDetail ({ data }: { data: any }) {

  const orderInfo = [
    { label: 'Mã đơn hàng', value: data?.orderCode },
    {
      label: 'Trạng thái đơn',
      value: orderStatus.find(item => item.defaultValue === data?.orderStatus)?.label
    },
    {
      label: 'Trạng thái thanh toán',
      value: data?.paymentStatus === 'REJECTED' ? 'Đã hủy'
        : data?.paymentStatus === 'PENDING' ? 'Đang chờ'
          : 'Thành công',
      className: data?.paymentStatus === 'REJECTED' ? 'text-red-400'
        : data?.paymentStatus === 'PENDING' ? 'text-yellow-400'
          : 'text-green-400'
    },
    {
      label: 'Sản phẩm',
      value: insuranceType.find(item => item.value === data?.insuranceType)?.title
    },
    {
      label: 'Thời gian tạo đơn',
      value: new Date(data?.createdAt).toLocaleString('vi-VN', optionDate)
    },
    {
      label: 'Phí bảo hiểm',
      value: `${data?.price?.toLocaleString('vi-VN')} VNĐ`
    },
  ];

// Thông tin người mua
  const buyerInfo = [
    { label: 'Tên người mua', value: data?.insuranceOrder?.fullName },
    { label: 'Số điện thoại', value: data?.insuranceOrder?.phoneNumber },
    { label: 'Email', value: data?.insuranceOrder?.email },
    { label: 'Số CCCD', value: data?.insuranceOrder?.identifiCard },
    { label: 'Địa chỉ', value: data?.insuranceOrder?.address },
  ];

// Thông tin chủ xe (nếu có)
  const ownerInfo = data?.insuranceOrder?.owner ? [
    { label: 'Tên', value: data?.insuranceOrder?.owner },
    { label: 'Số điện thoại', value: data?.insuranceOrder?.phoneNumberOwner },
    { label: 'Email', value: data?.insuranceOrder?.emailOwner },
    { label: 'Số CCCD', value: data?.insuranceOrder?.identifiCardOwner },
    { label: 'Địa chỉ', value: data?.insuranceOrder?.addressOwner },
  ] : null;

// Thông tin xe
  const vehicleInfo = [
    {
      label: 'Loại xe',
      value: vehicleType[data?.insuranceType]?.find(
        item => item.value === data?.insuranceOrder?.vehicleType
      )?.label
    },
    {
      label: 'Biển số xe',
      value: data?.insuranceOrder?.notLicensePlate
        ? 'Chưa có biển số'
        : data?.insuranceOrder?.licensePlate
    },
    { label: 'Số khung', value: data?.insuranceOrder?.chassisNumber },
    { label: 'Số máy', value: data?.insuranceOrder?.engineNumber },
    { label: 'Số chỗ ngồi', value: data?.insuranceOrder?.numberOfSeat },
  ];

  // Thông tin bảo hiểm
  const insuranceInfo = [
    {
      label: 'Ngày bắt đầu',
      value: data?.insuranceOrder?.insuranceDateStart
        ? new Date(data.insuranceOrder.insuranceDateStart).toLocaleString('vi-VN', optionDateNoTime)
        : '-'
    },
    {
      label: 'Thời hạn',
      value: `${data?.insuranceOrder?.insuranceDuration} năm`
    },
    {
      label: 'Bảo hiểm tai nạn',
      value: data?.insuranceOrder?.accidentInsurance ? 'Có' : 'Không'
    },
  ];

  const additionInsu = [
    {
      label: 'Số người tham gia bảo hiểm',
      value: `${data?.insuranceOrder?.participantAmount} người`
    },
    {
      label: 'Số năm tham gia bảo hiểm',
      value: `${data?.insuranceOrder?.insuranceDuration} năm`
    },
    {
      label: 'Mức trách nhiệm bảo hiểm',
      value: `${data?.insuranceOrder?.liabilityLimit?.toLocaleString('vi-VN')} VNĐ`
    },
  ]

  const invoiceInfo = [
    {
      label: 'Người mua',
      value: data?.insuranceOrder?.invoiceCustomer || ''
    },
    {
      label: 'Mã số thuế',
      value: data?.insuranceOrder?.invoiceTexCode || ''
    },
    {
      label: 'Địa chỉ',
      value: data?.insuranceOrder?.invoiceAddress || ''
    },
    {
      label: 'Số điện thoại',
      value: data?.insuranceOrder?.invoicePhone || ''
    },
    {
      label: 'Diễn giải bổ sung',
      value: data?.insuranceOrder?.invoiceMoreInfor || ''
    },
  ]

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
          Bảo hiểm ô tô
        </h1>
        {data.insuranceOrder.image && (
          <div>
            <img
              src={data.insuranceOrder.image}
              className="max-w-[400px] w-full h-auto mx-auto"
            />
          </div>
        )}

        <InfoSection title="Thông tin đơn hàng" data={orderInfo} />
        <InfoSection title="Thông tin người mua" data={buyerInfo} />
        {ownerInfo && <InfoSection title="Thông tin thụ hưởng" data={ownerInfo} />}
        <InfoSection title="Thông tin phương tiện" data={vehicleInfo} />
        <InfoSection title="Thông tin bảo hiểm" data={insuranceInfo} />
        {data?.insuranceOrder?.accidentInsurance && <InfoSection title="Thông tin bảo hiểm tai nạn" data={additionInsu} />}
        {data?.insuranceOrder?.invoice && <InfoSection title="Thông tin hoá đơn thuế" data={invoiceInfo} />}

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
