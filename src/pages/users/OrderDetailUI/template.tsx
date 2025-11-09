// Component render
export const InfoRow = ({ label, value, className }: { label: string; value: any; className?: string }) => (
  <div className="flex justify-between border-b border-gray-300 py-2.5 gap-5">
    <div className="w-[30%] opacity-75">{label}</div>
    <div className={`font-medium text-right ${className || ''}`}>{value}</div>
  </div>
);

export const InfoSection = ({ title, data }: { title: string; data: any[] }) => (
  <div className="mt-5">
    <div className="text-[#f97317] italic font-medium mb-3">{title}</div>
    {data.map((item, index) => (
      <InfoRow
        key={index}
        label={item.label}
        value={item.value}
        className={item.className}
      />
    ))}
  </div>
);
