import type { ServerEvents } from "../types/types";

export const JSONToMessage = (data: string) => {
  const parsedMessage: ServerEvents = JSON.parse(data);
  return parsedMessage;
};
