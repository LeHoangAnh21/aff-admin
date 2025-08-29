import ResetPasswordPage from "@/pages/authentication/reset-password";
import SignInPage from "@/pages/authentication/sign-in";
import SignUpPage from "@/pages/authentication/sign-up";

const publicRoutes = [
    // {path: "/", element: <Dashboard/>},
    { path: "/login", element: SignInPage },
    { path: "/reset-password", element: ResetPasswordPage },
    { path: "/register", element: SignUpPage },

]
export default publicRoutes;