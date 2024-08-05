import type { ClientEvents } from "../types/types";

export const JSONToMessage = (data: string) => {
  const parsedMessage: ClientEvents = JSON.parse(data);
  return parsedMessage;
};
