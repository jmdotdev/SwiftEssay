import { verifyToken } from "@/utils/verifyToken";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader } from 'lucide-react';

export const Auth = ({ children }) => {
   const location = useLocation();
   const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);


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
    if (isAuthenticated === null) {
    return <div className="flex items-center justify-center w-screen h-screen">
      <Loader className="h-20 w-20 m-auto animate-spin opacity-75"/>
    </div>;
  }

   if (!isAuthenticated) {
      return <Navigate to='/login' state={{ from: location }} replace />
   }
   return <>{children}</>
}
