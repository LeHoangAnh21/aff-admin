import { Routes, Route } from "react-router";
import FlowbiteWrapper from "./components/flowbite-wrapper";
import protectedRoutes from "./routes/ProtectedRoutes";
import publicRoutes from "./routes/PublicRoutes";
import Auth from "./components/Auth";

const App = () => {
  return (
    <Routes>
      <Route element={<FlowbiteWrapper />}>
        <Route element={<Auth />}>
          {protectedRoutes.map(({ path, element: Component }, index) => (
            <Route path={path} element={<Component />} key={index} />
          ))}
        </Route>
        {publicRoutes.map(({ path, element: Component }, index) => (
          <Route path={path} element={<Component />} key={index} />
        ))}
      </Route>
    </Routes>
  );
};

export default App;
