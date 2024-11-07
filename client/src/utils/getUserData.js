export const getUserData = () => {
  const token = localStorage.getItem("token");
  if (!token) return null; // Return null if the token is missing

  try {
    const decodedToken = atob(token.split(".")[1]);
    const userData = JSON.parse(decodedToken);
    return userData.payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};