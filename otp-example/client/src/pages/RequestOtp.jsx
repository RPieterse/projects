import React, { useCallback, useEffect } from "react";
import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  ChakraProvider,
  Center,
} from "@chakra-ui/react";
import useOTP from "../hooks/useOTP.js";
import useFeedback from "../hooks/useFeedback.js";
import { useNavigate } from "react-router-dom";
import { isFalse } from "../utils/index.js";
import { isEmpty } from "lodash";

const RequestOtp = () => {
  // Hooks
  const { email, setEmail, loading, requestOtp } = useOTP();
  const feedback = useFeedback();
  const navigate = useNavigate();

  // Handle OTP request function, Feedback and Redirect
  async function handleOtpRequest(e) {
    e.preventDefault();
    try {
      await requestOtp(email);
      navigate("/verify");
    } catch (err) {
      feedback.error(err.message);
    }
  }

  // fetch stored email of user
  const getEmail = useCallback(() => {
    return sessionStorage.getItem("email");
  }, []);

  useEffect(() => {
    if (isFalse(isEmpty(getEmail()))) {
      setEmail(getEmail());
    }
  }, [getEmail, setEmail]);

  return (
    <ChakraProvider>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          justifyContent={"center"}
          my={12}
          textAlign={"center"}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Request an OTP
          </Heading>
          <Text
            fontSize={{ base: "sm", sm: "md" }}
            color={useColorModeValue("gray.800", "gray.400")}
          >
            You&apos;ll get an email with a your OTP
          </Text>
          <form onSubmit={handleOtpRequest}>
            <FormControl id="email">
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="your-email@example.com"
                _placeholder={{ color: "gray.500" }}
                type="email"
              />
            </FormControl>
            <Stack mt={6}>
              <Button
                type="submit"
                isLoading={loading}
                colorScheme="teal"
                bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
                color="white"
                variant="solid"
              >
                Request OTP
              </Button>
            </Stack>
          </form>
          <Center>
            <Text
              cursor={"pointer"}
              _hover={{ textDecoration: "underline" }}
              color={"teal"}
              onClick={() => navigate("/verify")}
            >
              Already have an OTP
            </Text>
          </Center>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
};

export default RequestOtp;
