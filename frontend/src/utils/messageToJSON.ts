import type { ClientEvents } from "../types/types";

export const messageToJSON = (message: ClientEvents) => {
  return JSON.stringify(message);
};
