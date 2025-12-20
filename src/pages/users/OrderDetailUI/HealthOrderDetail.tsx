import {country, insuranceType, optionDate, optionDateNoTime, orderStatus, vehicleType} from "@/libs/data";
import {Link} from "react-router-dom";
import {InfoSection} from "@/pages/users/OrderDetailUI/template";

enum RelationshipKey {
  SELF = 'QH00000',
  PARENT = 'QH00001',
  SPOUSE = 'QH00002',
  SIBLING = 'QH00003',
  CHILD = 'QH00007',
}

export const relationships = [
  { key: RelationshipKey.SELF, label: 'Bản thân' },
  { key: RelationshipKey.PARENT, label: 'Cha/Mẹ' },
  { key: RelationshipKey.SPOUSE, label: 'Vợ/Chồng' },
  { key: RelationshipKey.SIBLING, label: 'Anh/Chị/Em' },
  { key: RelationshipKey.CHILD, label: 'Con cái' },
];

export default function HealthOrderDetail ({ data }: { data: any }) {
  const birthDate = new Date(data.insuranceOrder.dateOfBirthOwner);
  const today = new Date();

  // Tính số milliseconds chênh lệch
  const diffMs = today.getTime() - birthDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

// Tính tuổi
  const ageYears = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  let age: string;

  if (ageYears > 1 || (ageYears === 1 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)))) {
    // Đã đủ 1 tuổi trở lên
    let actualAge = ageYears;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      actualAge--;
    }
    age = `${actualAge} tuổi`;
  } else {
    // Chưa đủ 1 tuổi - tính theo ngày
    age = `${diffDays} ngày tuổi`;
  }

  const getRelationshipLabel = (key: string): string => {
    const relationship = relationships.find(r => r.key === key);
    return relationship?.label || key;
  };

  const buyerInfo = [
    { label: 'Tên người mua', value: data.insuranceOrder?.fullName },
    { label: 'Địa chỉ', value: data.insuranceOrder?.address },
    {
      label: 'Ngày sinh',
      value: data.insuranceOrder?.dateOfBirth
        ? new Date(data.insuranceOrder.dateOfBirth).toLocaleString('vi-VN', optionDateNoTime)
        : '-'
    },
    { label: 'Giới tính', value: data.insuranceOrder?.sex === 'NU' ? 'Nữ' : 'Nam' },
    { label: 'Số CCCD', value: data.insuranceOrder?.identifiCard },
    {
      label: 'Ngày cấp CCCD',
      value: data.insuranceOrder?.identifiCardValueDate
        ? new Date(data.insuranceOrder.identifiCardValueDate).toLocaleString('vi-VN', optionDateNoTime)
        : '-'
    },
    { label: 'Nơi cấp', value: data.insuranceOrder?.placeOfSupply },
    { label: 'Số điện thoại', value: data.insuranceOrder?.phoneNumber },
    { label: 'Email', value: data.insuranceOrder?.email },
  ];

  const ownerInfo = [
    { label: 'Tên người được bảo hiểm', value: data.insuranceOrder?.owner },
    { label: 'Địa chỉ', value: data.insuranceOrder?.addressOwner },
    {
      label: 'Ngày sinh',
      value: data.insuranceOrder?.dateOfBirthOwner
        ? new Date(data.insuranceOrder.dateOfBirthOwner).toLocaleString('vi-VN', optionDateNoTime)
        : '-'
    },
    { label: 'Tuổi', value: age ? age : '' },
    { label: 'Giới tính', value: data.insuranceOrder?.sexOwner === 'NU' ? 'Nữ' : 'Nam' },
    { label: 'Số CCCD', value: data.insuranceOrder?.identifiCardOwner },
    {
      label: 'Ngày cấp CCCD',
      value: data.insuranceOrder?.identifiCardValueDateOwner
        ? new Date(data.insuranceOrder.identifiCardValueDateOwner).toLocaleString('vi-VN', optionDateNoTime)
        : '-'
    },
    { label: 'Nơi cấp', value: data.insuranceOrder?.placeOfSupplyOwner },
    { label: 'Số điện thoại', value: data.insuranceOrder?.phoneNumberOwner },
    { label: 'Email', value: data.insuranceOrder?.emailOwner },
  ];

  const insuranceInfo = [
    { label: 'Mã bảo hiểm', value: data.insuranceOrder?.insuranceCode },
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
    {
      label: 'Quan hệ với người mua',
      value: getRelationshipLabel(data.insuranceOrder?.relationshipWithBuyer)
    },
    {
      label: 'Bố hoặc Mẹ đã mua bảo hiểm',
      value: data.insuranceOrder?.hasParentHealthInsurance ? 'Có' : 'Không',
    },
  ];

  const benefitsInfo = [
    { label: 'Thai sản', value: data.insuranceOrder?.isMaternity ? 'Có' : 'Không' },
    { label: 'Điều trị ngoại trú', value: data.insuranceOrder?.isOutpatientTreatment ? 'Có' : 'Không' },
    { label: 'Nha khoa', value: data.insuranceOrder?.isDental ? 'Có' : 'Không' },
    { label: 'Quyền lợi tai nạn', value: data.insuranceOrder?.isAccidentBenefits ? 'Có' : 'Không' },
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
          Bảo hiểm sức khoẻ
        </h1>
        {data.insuranceOrder.frontIdentifiCardImg && (
          <div>
            <img
              src={data.insuranceOrder.frontIdentifiCardImg}
              className="max-w-[400px] w-full h-auto mx-auto"
            />
          </div>
        )}
        {data.insuranceOrder.backIdentifiCardImg && (
          <div>
            <img
              src={data.insuranceOrder.backIdentifiCardImg}
              className="max-w-[400px] w-full h-auto mx-auto"
            />
          </div>
        )}

        <InfoSection title="Thông tin đơn hàng" data={buyerInfo} />
        <InfoSection title="Thông tin người mua" data={buyerInfo} />
        <InfoSection title="Thông tin thụ hưởng" data={ownerInfo} />
        <InfoSection title="Thông tin bảo hiểm" data={insuranceInfo} />
        <InfoSection title="Bảo hiểm bổ sung" data={benefitsInfo} />

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
