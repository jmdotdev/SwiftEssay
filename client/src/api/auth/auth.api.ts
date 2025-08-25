import { api } from "@/axios/axios-instance";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const res = await api.post("/writers/login", {
      email,
      password,
    });
    if (!res) return "";
    return res.data.token;
  } catch (error) { return "" }
};
