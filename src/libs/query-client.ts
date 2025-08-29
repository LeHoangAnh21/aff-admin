import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Giảm stale time để data luôn fresh
      staleTime: 30 * 1000, // 30 giây
      // Giảm cache time để không lưu cache quá lâu
      gcTime: 5 * 60 * 1000, // 5 phút (trước đây là cacheTime)
      // Tắt retry để tăng tốc độ
      retry: 1,
      retryDelay: 300,
      // Tắt refetch khi focus để tránh request không cần thiết
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      // Tăng timeout
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      retryDelay: 300,
      networkMode: 'online',
    },
  },
});

// Loại bỏ setInterval để tránh lỗi server-side
// setInterval(() => {
//   queryClient.clear();
// }, 10 * 60 * 1000); 