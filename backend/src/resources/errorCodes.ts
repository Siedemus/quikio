export const errorCodes = {
  PARSING_ERROR: {
    code: 99,
    content: "Something went wrong during message parsing.",
  },
  VALIDATION_ERROR: {
    code: 100,
    content:
      "Validation failed: Username or password does not meet the required criteria.",
  },
  DATABASE_ERROR: {
    code: 101,
    content: "A database error occurred while processing the request.",
  },
  PASSWORD_MISMATCH_ERROR: {
    code: 102,
    content: "Password does not match the expected value.",
  },
  WRONG_MESSAGE_EVENT_ERROR: {
    code: 103,
    content: "An unexpected message event was received.",
  },
  EXPIRED_TOKEN: {
    code: 104,
    content: "Your token is probably expired.",
  },
  ALREADY_SUBSCRIBING: {
    code: 105,
    content: "You are already subscribing to this room.",
  },
  ROOM_DOESNT_EXIST: {
    code: 106,
    content: "Room doesnt exist.",
  },
  
};
