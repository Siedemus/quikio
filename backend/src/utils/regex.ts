const usernameRegex = /^[a-zA-Z0-9]{1,20}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,35}$/;

export default {
  usernameRegex,
  passwordRegex,
};
