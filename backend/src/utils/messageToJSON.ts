import type {
  ServerEvents,
} from "../types/types";

export const messageToJSON = (message: ServerEvents) => {
  return JSON.stringify(message);
};
