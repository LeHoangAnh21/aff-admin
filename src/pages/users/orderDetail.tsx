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
import { HiHome, HiUpload, HiX, HiDocumentText } from "react-icons/hi";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CarOrderDetail from "@/pages/users/OrderDetailUI/CarOrderDetail";
import MotorOrderDetail from "@/pages/users/OrderDetailUI/MotorOrderDetail";
import TravelOrderDetail from "@/pages/users/OrderDetailUI/TravelOrderDetail";
import HealthOrderDetail from "@/pages/users/OrderDetailUI/HealthOrderDetail";
import BodyShellOrderDetail from "@/pages/users/OrderDetailUI/BodyShellOrderDetail";
import AccidentOrderDetail from "@/pages/users/OrderDetailUI/AccidentOrderDetail";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [sessionToken, setSessionToken] = useState("");
  const [linkInsurance, setLinkInsurance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultType, setResultType] = useState<"link" | "file">("link");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { data, error, refetch, isFetching, isPending, isRefetching } = useQuery<any>({
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Kiểm tra số lượng file
    if (files.length + selectedFiles.length > 5) {
      toast.error("Chỉ được chọn tối đa 5 file!", {
        autoClose: 3000,
      });
      return;
    }

    // Kiểm tra định dạng file
    const validFormats = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    const invalidFiles = files.filter(file => !validFormats.includes(file.type));

    if (invalidFiles.length > 0) {
      toast.error("File không đúng định dạng! Chỉ chấp nhận PDF, Excel, Word và ảnh.", {
        autoClose: 3000,
      });
      return;
    }

    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    if (fileType.includes('document') || fileType.includes('word')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUpdateLink = async () => {
    if (resultType === "link" && !linkInsurance) {
      toast.error("Không được để trống đường dẫn!", {
        autoClose: 5000,
      });
      return;
    }

    if (resultType === "file" && selectedFiles.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 file!", {
        autoClose: 5000,
      });
      return;
    }

    try {
      setIsLoading(true);

      if (resultType === "link") {
        await Order.linkInsurance(
          data.id,
          { resultType, insuranceLink: linkInsurance },
          sessionToken
        );
        toast.success("Cập nhật link bảo hiểm cho khách hàng thành công!", {
          autoClose: 5000,
        });
      } else {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });

        const res = await Order.uploadInsuFile(formData, sessionToken);

        await Order.linkInsurance(
          data.id,
          { resultType, listInsuFile: res },
          sessionToken
        );

        toast.success("Upload file bảo hiểm thành công!", {
          autoClose: 5000,
        });
      }
    } catch (error: any) {
      toast.error('Lỗi cập nhật. Vui lòng thử lại.', {
        autoClose: 5000,
      });
    } finally {
      await refetch()
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
      case '05':
        return <AccidentOrderDetail data={data} />
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

        { !data?.isDone &&
          (
            <div className="sm:flex flex-col p-5 border border-gray-200 dark:border-gray-700">
              <h1 className="dark:text-gray-200 text-gray-600 text-2xl font-medium mb-4">
                Thông tin chi tiết đơn hàng (Hãy kiểm tra kĩ trước khi upload, bạn không thể thay đổi kết quả sau khi upload)
              </h1>

              {data?.paymentStatus === "SUCCESS" ? (
                <div className="space-y-4">
                  <div className="flex gap-6 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="resultType"
                        value="link"
                        checked={resultType === "link"}
                        onChange={(e) => setResultType(e.target.value as "link")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Kết quả dạng Link
                  </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="resultType"
                        value="file"
                        checked={resultType === "file"}
                        onChange={(e) => setResultType(e.target.value as "file")}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Kết quả dạng File
                  </span>
                    </label>
                  </div>

                  {resultType === "link" ? (
                    <div className="flex gap-3 items-center">
                      <SearchInput
                        value={linkInsurance}
                        onChange={(e) => setLinkInsurance(e.target.value)}
                        id="link"
                        placeholder="Nhập link bảo hiểm cho khách hàng..."
                        className="flex-1 max-w-2xl"
                      />
                      <Button
                        onClick={handleUpdateLink}
                        disabled={
                          data?.orderStatus === "COMPLETE" ||
                          data?.orderStatus === "CANCELLED" ||
                          data?.orderStatus === "REJECTED" ||
                          isLoading
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isLoading ? (
                          <Spinner size="sm" light className="mr-2" />
                        ) : null}
                        {isLoading ? 'Đang cập nhật' : 'Cập nhật' }
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="file"
                          id="file-upload"
                          multiple
                          accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png,.gif,.webp"
                          onChange={handleFileChange}
                          disabled={selectedFiles.length >= 5}
                          className="hidden"
                        />
                        <label
                          htmlFor="file-upload"
                          className={`flex flex-col items-center justify-center w-full max-w-2xl h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                            selectedFiles.length >= 5
                              ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60 dark:border-gray-600 dark:bg-gray-800'
                              : 'border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/30'
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <HiUpload className={`w-10 h-10 mb-3 ${selectedFiles.length >= 5 ? 'text-gray-400' : 'text-blue-500 dark:text-blue-400'}`} />
                            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-semibold">Click để chọn file</span> hoặc kéo thả vào đây
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              PDF, Excel, Word, hoặc ảnh (Tối đa 5 file - Đã chọn: {selectedFiles.length}/5)
                            </p>
                          </div>
                        </label>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="max-w-2xl space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            File đã chọn ({selectedFiles.length}):
                          </p>
                          <div className="space-y-2">
                            {selectedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-650 transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="text-2xl flex-shrink-0">
                                {getFileIcon(file.type)}
                              </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatFileSize(file.size)}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveFile(index)}
                                  className="ml-3 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors flex-shrink-0"
                                  title="Xóa file"
                                >
                                  <HiX className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleUpdateLink}
                        disabled={
                          data?.orderStatus === "COMPLETE" ||
                          data?.orderStatus === "CANCELLED" ||
                          data?.orderStatus === "REJECTED" ||
                          isLoading ||
                          selectedFiles.length === 0
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isLoading ? (
                          <Spinner size="sm" light className="mr-2" />
                        ) : (
                          <HiUpload className="mr-2 h-5 w-5" />
                        )}
                        { isLoading ? 'Đang upload file' : 'Upload file' }
                      </Button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )
        }

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
          <div className="flex-1 flex flex-col py-10">
            {renderOrderDetailUi(data)}

            <div className='w-full flex justify-center'>
              { data?.resultType === 'file' && data?.insuResultFile.length > 0 && (
                <div className='max-w-2xl'>
                  <div className='flex justify-between py-[10px] mt-5 italic text-[#f97317]'>
                    <div className='opacity-75'>Danh sách file kết quả bảo hiểm (Bấm để mở hoặc tải xuống)</div>
                  </div>
                  {data?.insuResultFile.map((file: any, index: any) => (
                    <Link
                      to={file.link}
                      target="_blank"
                      key={index}
                      className="flex items-center mb-2 gap-3 p-3 rounded-lg text-white border hover:text-gray-900 border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium  truncate" title={file.fileName}>
                          {file.fileName} ({Math.round(file.fileSize/1024)} MB)
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) }
            </div>
          </div>
        )}
      </div>
    </NavbarSidebarLayout>
  );
}
