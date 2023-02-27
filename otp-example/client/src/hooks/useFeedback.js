import { useToast } from "@chakra-ui/react";

/**
 * Hook creates user feedback in the form of toast messages
 *
 * @returns {Object} {success, error}
 */
function useFeedback() {
  const toast = useToast();

  /**
   * Success Toast
   * @param {String} description
   */
  function success(description) {
    return toast({
      title: "Success!",
      description,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }

  /**
   * Error Toast
   * @param {String} description
   */
  function error(description) {
    return toast({
      title: "Oops! Error",
      description,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  return { success, error };
}

export default useFeedback;
