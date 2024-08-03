import type { AuthorizationMessage, AuthorizedMessage, ErrorMessage } from "../types/types";

export const messageToJSON = (message: AuthorizationMessage | ErrorMessage | AuthorizedMessage) => {
  return JSON.stringify(message);
};
