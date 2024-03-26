export const getUserId = () => {
  const token = localStorage.getItem("token");
  const decodedToken = atob(token.split(".")[1]);
  const userData = JSON.parse(decodedToken);
  return userData?.payload?.userId;
};