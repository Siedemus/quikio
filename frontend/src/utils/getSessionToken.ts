const getSessionToken = () => {
  const token = localStorage.getItem("token");

  return token;
};

export default getSessionToken;
