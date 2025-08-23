import { verifyToken } from "@/utils/verifyToken";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export const Auth = ({ children }) => {
   const location = useLocation();
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);


   useEffect(() => {
      const checkAuth = async () => {
         const token = localStorage.getItem('token');
         if (!token) {
            setIsAuthenticated(false);
            return;
         };
         const isValidToken = await verifyToken(token);
         try {
            setIsAuthenticated(isValidToken)
            return children;
         } catch (error) {
            setIsAuthenticated(false)
         }
      }
      checkAuth();
   }, [])

   if (!isAuthenticated) {
      return <Navigate to='/login' state={{ from: location }} replace />
   }
   return <div>{children}</div>
}
