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

export default function AccidentOrderDetail ({ data }: { data: any }) {

  const buyerInfo = [
    { label: 'Đại diện mua hàng', value: data.insuranceOrder?.companyName },
    { label: 'Mã số thuế', value: data.insuranceOrder?.companyTaxCode },
    {
      label: 'Đia chỉ',
      value: data.insuranceOrder?.companyAddress
    },
  ];

  const ownerInfo = [
    { label: 'Họ và tên', value: data.insuranceOrder?.ownerInsu },
    {
      label: 'Vị trí/Vai trò',
      value: data.insuranceOrder?.position
    },
    { label: 'Tuổi', value: data.insuranceOrder?.ownerAge },
    { label: 'Số CCCD', value: data.insuranceOrder?.idNumber },
    { label: 'Số điện thoại', value: data.insuranceOrder?.ownerPhone },
    { label: 'Email', value: data.insuranceOrder?.ownerEmail },
  ];

  const insuranceInfo = [
    { label: 'Gói bảo hiểm', value: data.insuranceOrder?.insurancePackageValue.toLocaleString('vi-VN') },
    {
      label: 'Bảo hiểm tử vong, thương tật vĩnh viễn',
      value: `${data.insuranceOrder?.isPublicTransportDeath ? 'Có' : 'Không'}`
    },
    {
      label: 'Bảo hiểm thương tật bộ phận vĩnh viễn',
      value: `${data.insuranceOrder?.isPoisoningCovered ? 'Có' : 'Không'}`
    },
    {
      label: 'Bảo hiểm thương tật tạm thời',
      value: `${data.insuranceOrder?.isHospitalAllowance ? 'Có' : 'Không'}`
    }
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

        <InfoSection title="Thông tin bên mua" data={buyerInfo} />
        <InfoSection title="Thông tin người được bảo hiểm" data={ownerInfo} />
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
