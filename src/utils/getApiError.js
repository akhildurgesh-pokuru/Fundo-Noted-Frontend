export function getApiError(error, fallback) {
    const response = error.response?.data;
  
    if (typeof response === "string" && response.trim()) {
      return response;
    }
  
    if (
      typeof response?.message === "string" &&
      response.message.trim()
    ) {
      return response.message;
    }
  
    if (error.response?.status === 401) {
      return "Your session may have expired or your request was rejected.";
    }
  
    if (error.response?.status === 400) {
      return "The backend rejected the request. Check the submitted fields.";
    }
  
    if (!error.response) {
      return "Unable to connect to the server.";
    }
  
    return fallback;
  }