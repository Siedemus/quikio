const errorCodes = {
  UNEXPECTED_ERROR_DURING_CLOSING_CONNECTION: {
    code: 1,
    content:
      "An unexpected error occurred while closing the connection and removing listeners. Please refresh the page and try again.",
  },
  UNEXPECTED_ERROR: {
    code: 2,
    content: "An unexpected error occurred. Please try again later.",
  },
  NOT_HANDLED_ERROR: {
    code: 3,
    content:
      "An unhandled event was encountered.",
  },
  CANT_CONNECT_TO_SERVER: {
    code: 4,
    content:
      "Unable to establish a connection with the server. Please check your internet connection and try again later.",
  },
};

export default errorCodes;
