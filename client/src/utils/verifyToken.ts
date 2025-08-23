import axios from 'axios';

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const res = await axios.post("http://localhost:5000/writers/verifyToken", { token });
    if (res.status !== 200) return false;
    if (res.status === 200 && res.data) return true;
  } catch (error) {
    return false;
  }
};

