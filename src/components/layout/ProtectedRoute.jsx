import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Spinner from "../ui/Spinner";

const ProtectedRoute = ({ children }) => {
     const { user, loading } = useSelector((state) => state.auth);

     if (loading) {
          return (
               <div className="min-h-screen bg-bg flex items-center justify-center">
                    <Spinner size="md" />
               </div>
          );
     }

     if (!user) {
          return <Navigate to="/" replace />;
     }

     return children;
};

export default ProtectedRoute;