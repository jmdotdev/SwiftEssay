import { BellDot, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { verifyToken } from "../../utils/verifyToken";

type TopNavProps = {
  header: string;
  toggleNav: () => void;
}
export const TopNav = ({header, toggleNav}: TopNavProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      // await verifyToken(setLoggedInUser, setIsLoggedIn, navigate);
    };

    fetchData();
  }, [isLoggedIn]);
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Menu className="block lg:hidden cursor-pointer mr-2" onClick={toggleNav}/>
        <h2 className="text-xl font-semibold">{header.charAt(0).toUpperCase() + header.slice(1)}</h2>
      </div>
      <div className="flex items-center">
        <BellDot className="h-6 w-6 text-gray-950 mx-2" />
        <div className="flex items-center">
          <img className="h-6 w-6" src='/images/avatar.webp' alt="avatar.png" />
        </div>
      </div>
    </div>
  );
};
