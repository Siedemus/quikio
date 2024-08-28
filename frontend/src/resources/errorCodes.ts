const errorCodes = {
  UNEXPECTED_ERROR_TRYING_AGAIN: {
    code: 201,
    content:
      "An unexpected error occurred. We are trying to reconnect to the server.",
  },
  NOT_HANDLED_ERROR: {
    code: 202,
    content: "An unhandled event was encountered.",
  },
  CANT_CONNECT_TO_SERVER: {
    code: 203,
    content:
      "Unable to establish a connection with the server. Please check your internet connection and try again later.",
  },
  WEBSOCKET_REF_NULL: {
    code: 204,
    content:
      "WebSocket reference is null. Please ensure the WebSocket is properly initialized and try again.",
  },
};

export default errorCodes;
