import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../features/auth/authSlice";
import { logoutUser } from "../features/auth/authThunks";

const useAuth = () => {
     const dispatch = useDispatch();
     const { user, loading, error } = useSelector((state) => state.auth);

     const logout = () => dispatch(logoutUser());
     const clear = () => dispatch(clearError());

     return { user, loading, error, logout, clear };
};

export default useAuth;