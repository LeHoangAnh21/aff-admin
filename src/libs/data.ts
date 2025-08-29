export const optionDate: any = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
};

export const optionDateNoTime: any = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
};

export const withdrawStatus = [
    {
        value: "PENDING",
        label: "Chờ xác nhận",
        color: "#633112",
        bgColor: "#fce96a",
    },
    { value: "DONE", label: "Thành công", color: "#014737", bgColor: "#bcf0da" },
    {
        value: "REJECTED",
        label: "Đã từ chối",
        color: "#771d1d",
        bgColor: "#fbd5d5",
    },
    // {
    //     value: "CANCELED",
    //     label: "Đã hủy",
    //     color: "#771d1d",
    //     bgColor: "#fbd5d5",
    // },

];

export const orderStatus = [
    {
        value: "01",
        label: "Chờ xác nhận",
        color: "warning",
        bgColor: "#fce96a",
        defaultValue: "PENDING",
    },
    {
        value: "02",
        label: "Đang xử lý đơn",
        color: "info",
        bgColor: "#d1d5db",
        defaultValue: "PROCESSING",
    },
    // {
    //     value: "03",
    //     label: "Đang vận chuyển",
    //     color: "gray",
    //     bgColor: "#c3ddfd",
    //     defaultValue: "INSHIPPING",
    // },

    {
        value: "04",
        label: "Hoàn thành",
        color: "success",
        bgColor: "#bcf0da",
        defaultValue: "COMPLETED",
    },

    {
        value: "05",
        label: "Đã huỷ",
        color: "pink",
        bgColor: "#fbd5d5",
        defaultValue: "CANCELLED",
    },

    {
        value: "06",
        label: "Đã từ chối",
        color: "failure",
        bgColor: "#fbd5d5",
        defaultValue: "REJECTED",
    },
];

export const ROLE_LABELS = [
    { value: "SENIOR_SALES_DIRECTOR", label: "Giám đốc kinh doanh cấp cao", color: "#059669" },
    { value: "SALES_DIRECTOR", label: "Giám đốc kinh doanh", color: "#d97706" },
    { value: "VIP", label: "VIP", color: "#800080" },
    { value: "SYSTEM_MANAGER", label: "Quản lý hệ thống", color: "#ec4899" },

    { value: "CONSUMER", label: "Khách hàng", color: "#2563eb" },
] as const;

export const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],

    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],

    ["clean"],
];

export const insuranceType = [
    { title: "Bảo hiểm ô tô", value: "01" },
    { title: "Bảo hiểm xe máy", value: "02" },
    { title: "Bảo hiểm du lịch", value: "03" },
    { title: "Bảo hiểm sức khoẻ", value: "05" },
    { title: "Bảo hiểm viện phí", value: "06" },
];

export const vehicleType: any = {
    '01': [
        {
            value: '01',
            label: 'Xe ô tô không kinh doanh',
        },
        {
            value: '02',
            label: 'Xe ô tô kinh doanh',
        },
        {
            value: '03',
            label: 'Xe ô tô chở hàng',
        },
    ],
    '02': [
        { value: '01', label: 'Dưới 50cc' },
        { value: '02', label: 'Trên 50cc' },
        { value: '03', label: 'Xe đạp điện, xe máy điện' },
        { value: '04', label: 'Xe 3 bánh' },
    ],
};

export const country = [
    { value: "01", label: "Trong nước", liabilityLimit: 50000000 },
    { value: "02", label: "Nước ngoài", liabilityLimit: 100000000 }

];