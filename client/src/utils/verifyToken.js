import axios from 'axios';

const verifyToken = async (SetLoggedInUser, setIsLoggedIn, navigate) => {
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

export default verifyToken;
