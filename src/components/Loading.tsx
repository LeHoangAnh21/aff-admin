export default function Loading({ isLoading }: { isLoading: boolean }) {
  return (
    <div
      className={`fixed top-[64px] left-0 w-full h-1 z-[999] ${
        true ? "loading opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute rounded-full top-0 w-[20%] h-1 bg-primary-300"></div>
    </div>
  );
}
