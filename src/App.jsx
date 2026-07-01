import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./features/auth/authThunks";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

const App = () => {
     const dispatch = useDispatch();

     useEffect(() => {
          dispatch(getCurrentUser());
     }, []);

     return (
          <>
               <Toaster
                    position="top-center"
                    
               />
               <AppRoutes />
          </>
     );
};

export default App;
