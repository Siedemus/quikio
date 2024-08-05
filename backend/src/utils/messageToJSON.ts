import type {
  AuthorizationEvent,
  AuthorizedEvent,
  ErrorEvent,
  NewMessageEvent,
} from "../types/types";

export const messageToJSON = (
  message: AuthorizationEvent | ErrorEvent | AuthorizedEvent | NewMessageEvent
) => {
  return JSON.stringify(message);
};
