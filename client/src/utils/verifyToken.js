import axios from 'axios';

export const verifyToken = async (SetLoggedInUser, setIsLoggedIn, navigate) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post("http://localhost:5000/writers/verifyToken", { token });
    SetLoggedInUser(res.data.payload);
    setIsLoggedIn(true);
  } catch (error) {
    setIsLoggedIn(false);
    navigate('/');
  }
};


export const getUserId = () =>{
   const token = localStorage.getItem('token')
   const decodedToken = atob(token.split('.')[1])
   const userData= JSON.parse(decodedToken)
   return userData?.payload?.userId
}
