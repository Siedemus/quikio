import type { AuthorizationMessage } from "../types/types";

export const JSONToMessage = (data: string) => {
  const parsedMessage: AuthorizationMessage = JSON.parse(data);
  return parsedMessage;
};
