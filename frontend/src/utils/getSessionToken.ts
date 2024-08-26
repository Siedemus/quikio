const getSessionToken = () => {
  const token = sessionStorage.getItem("token");

  return token
};

export default getSessionToken;
