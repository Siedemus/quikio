import type { JwtPayload } from "jsonwebtoken";

const checkToken = (token: unknown): token is JwtPayload => {
  return (
    token !== null &&
    typeof token === "object" &&
    "id" in token &&
    "name" in token &&
    typeof token.id === "number" &&
    typeof token.name === "string"
  );
};

export default checkToken;
