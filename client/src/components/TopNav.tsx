import { BellDot, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type TopNavProps = {
  header: string;
  toggleNav: () => void;
}
export const TopNav = ({header, toggleNav}: TopNavProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setShowDropDown(prev => !prev)
  };

  const navigateToProfile = () => {
    navigate('/profile/1')
    setShowDropDown(prev => !prev)
  }
  

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
        <h2 className="text-xl font-semibold text-darkBlue ml-1">{header.charAt(0).toUpperCase() + header.slice(1)}</h2>
      </div>
      <div className="flex items-center">
        <BellDot className="h-6 w-6 text-gray-950 mx-2" />
        <div className="flex items-center cursor-pointer relative">
          <img className="h-6 w-6" src='/images/avatar.webp' alt="avatar.png" onClick={() => setShowDropDown(!showDropDown)}/>
          {
            showDropDown && 
            <div className="absolute bg-white rounded-md top-5 right-1 mt-2">
             <ul className="list-none p-1">
                <li className="hover:bg-gray-300 px-3 rounded-md" onClick={navigateToProfile}>Profile</li>
                <li className="hover:bg-gray-300 px-3 rounded-md" onClick={logOut}>Logout</li>
             </ul>
          </div>
          }
        </div>
      </div>
    </div>
  );
};
