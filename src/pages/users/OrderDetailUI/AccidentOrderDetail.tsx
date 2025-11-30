import {Link} from "react-router-dom";
import {InfoSection} from "@/pages/users/OrderDetailUI/template";
import {orderStatus} from "@/libs/data";

export const AccidentInsuRelation = {
  YOUR: '01',
  PARENT: '02',
  BROTHER: '03',
}

export const AccidentInsuRelationType = [
  { value: AccidentInsuRelation.YOUR, label: 'Bản thân' },
  { value: AccidentInsuRelation.PARENT, label: 'Bố mẹ' },
  { value: AccidentInsuRelation.BROTHER, label: 'Anh/chị/em' },
]

export const AccidentInsuConst = {
  COMPANY: '01',
  PERSONAL: '02',
} as const;

export const InsuPackageConst = {
  COMPANY_BASE: '01',
  COMPANY_ADVANCED: '02',
  PERSONAL_BASE: '03',
  PERSONAL_MID: '04',
  PERSONAL_ADVANCED: '05',
}

export const InsuPackageValue = [
  { key: InsuPackageConst.COMPANY_BASE, value: 100000000 },
  { key: InsuPackageConst.COMPANY_ADVANCED, value: 200000000 },
  { key: InsuPackageConst.PERSONAL_BASE, value: 50000000 },
  { key: InsuPackageConst.PERSONAL_MID, value: 100000000 },
  { key: InsuPackageConst.PERSONAL_ADVANCED, value: 150000000 },
] as const;

export default function AccidentOrderDetail ({ data }: { data: any }) {

  const getRelationshipLabel = (key: string): string => {
    const relationship = AccidentInsuRelationType.find(r => r.value === key);
    return relationship?.label || key;
  };

  const companyInfo = [
    { label: 'Đại diện mua hàng', value: data.insuranceOrder?.companyName },
    { label: 'Mã số thuế', value: data.insuranceOrder?.companyTaxCode },
    {
      label: 'Đia chỉ',
      value: data.insuranceOrder?.companyAddress
    },
  ];

  const buyerInfo = [
    { label: 'Họ và tên', value: data.insuranceOrder?.buyerName },
    { label: 'Số CCCD', value: data.insuranceOrder?.buyerIdNumber },
    { label: 'Số điện thoại', value: data.insuranceOrder?.buyerPhone },
    { label: 'Email', value: data.insuranceOrder?.buyerEmail },
    { label: 'Địa chỉ', value: data.insuranceOrder?.buyerAddress },
  ];

  const ownerInfo = [
    { label: 'Họ và tên', value: data.insuranceOrder?.ownerInsu },
    {
      label: data.insuranceOrder?.isCompanyInsu === AccidentInsuConst.COMPANY　? 'Vị trí/Vai trò' : 'Mối quan hệ với người mua',
      value: data.insuranceOrder?.isCompanyInsu === AccidentInsuConst.COMPANY ? data.insuranceOrder?.position : getRelationshipLabel(data.insuranceOrder?.relation)
    },
    { label: 'Ngày sinh', value: data.insuranceOrder?.dOB },
    { label: 'Số CCCD', value: data.insuranceOrder?.idNumber },
    { label: 'Số điện thoại', value: data.insuranceOrder?.ownerPhone },
    { label: 'Email', value: data.insuranceOrder?.ownerEmail },
    { label: 'Địa chỉ', value: data.insuranceOrder?.ownerAddress },
  ];

  const insuranceInfo = [
    {
      label: 'Gói bảo hiểm',
      value:
        '₫' + InsuPackageValue.find(v => v.key === data.insuranceOrder?.insurancePackageValue)?.value.toLocaleString('vi-VN') || 0
    },
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
          Bảo hiểm tai nạn
        </h1>
        <div className='flex justify-between border-b-1 border-gray-300 py-[10px]'>
          <div className='opacity-75'>Mã đơn hàng</div>
          <div className='font-medium'>{data.orderCode}</div>
        </div>
        <div className='flex justify-between border-b-1 border-gray-300 py-[10px]'>
          <div className='opacity-75'>Giá</div>
          <div className='font-medium'>
            ₫{data.price.toLocaleString('vi-VN')}
          </div>
        </div>
        <div className='flex justify-between border-b-1 border-gray-300 py-[10px]'>
          <div className='opacity-75'>Loại bảo hiểm</div>
          <div className='font-medium'>
            { data.insuranceOrder?.isCompanyInsu === AccidentInsuConst.COMPANY
              ? 'BH doanh nghiệp'
              : 'BH cá nhân'
            }
          </div>
        </div>

        { data.insuranceOrder?.isCompanyInsu === AccidentInsuConst.COMPANY
          ? <InfoSection title="Thông tin bên mua" data={companyInfo} />
          : <InfoSection title="Thông tin bên mua" data={buyerInfo} />
        }
        <InfoSection title="Thông tin bên được bảo hiểm" data={ownerInfo} />
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
