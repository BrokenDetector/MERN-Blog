import { AuthContext, TAuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoadingScreen from "./Loading";

const ProtectedRoute = ({ requireAdmin }: { requireAdmin: boolean }) => {
    const { user, loading } = useContext(AuthContext) as TAuthContext;

    return (
        <>
            {loading ? (
                <LoadingScreen />
            ) : (
                <>
                    {requireAdmin ? (
                        user?.is_admin ? (
                            <Outlet />
                        ) : (
                            <Navigate to="/" />
                        )
                    ) : user !== null ? (
                        <Outlet />
                    ) : (
                        <Navigate to="/sign-in" />
                    )}
                </>
            )}
        </>
    );
};

export default ProtectedRoute;
