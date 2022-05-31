import { Navigate, Outlet } from "react-router-dom";

import { isAuthenticated } from '../services/Auth'

const PrivateRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;