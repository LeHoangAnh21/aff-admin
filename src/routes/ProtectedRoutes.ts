import DashboardPage from "@/pages/index";
import ProductPage from "@/pages/products/product";
import UserPage from "@/pages/users/user";
import OrderPage from "@/pages/users/order";
import WithdrawPage from "@/pages/users/withdraw";
import LawPage from "@/pages/users/law";
import ClaimPage from "@/pages/users/claim";
import ConsultationPage from "@/pages/users/consultation";
import SyncFeePage from "@/pages/users/syncFee";
import OrderDetailPage from "@/pages/users/orderDetail";
// import UserProfilePage from "@/pages/users/profile";
// import UserDetail from "@/pages/users/userDetail";
// import PlatformPage from "@/pages/products/platform"
// import CategoryPage from "@/pages/products/category";
// import WithdrawPage from "@/pages/users/withdraw";

const protectedRoutes = [
    // {path: "/", element: <Dashboard/>},
    { path: "/", element: DashboardPage },
    { path: "/users/list", element: UserPage },
    { path: "/users/withdraw", element: WithdrawPage },
    { path: "/users/order", element: OrderPage },
    { path: "/users/order/:id", element: OrderDetailPage },

    // { path: "/users/law", element: LawPage },
    // { path: "/users/claim", element: ClaimPage },
    { path: "/users/consultation-request", element: ConsultationPage },

    // { path: "/products/list", element: ProductPage },
    { path: "/fee", element: SyncFeePage },
    // { path: "/e-commerce/category", element: CategoryPage },


]

export default protectedRoutes;