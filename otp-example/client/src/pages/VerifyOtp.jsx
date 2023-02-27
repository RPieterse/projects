import React, { useCallback, useEffect } from "react";
import {
  Button,
  FormControl,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  HStack,
  PinInput,
  PinInputField,
  Center,
  ChakraProvider,
} from "@chakra-ui/react";
import useOTP from "../hooks/useOTP.js";
import useFeedback from "../hooks/useFeedback.js";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  // Hooks
  const { verifyOtp, otp, setOtp, loading } = useOTP();
  const feedback = useFeedback();
  const navigate = useNavigate();

  // fetch stored email of user
  const getEmail = useCallback(() => {
    return sessionStorage.getItem("email");
  }, []);

  // If no email is found, redirect user back to root
  useEffect(() => {
    if (isEmpty(getEmail())) {
      navigate("/");
    }
  }, [getEmail, navigate]);

  // handles verification of otp and feedback
  async function handleOtpVerification(e) {
    e.preventDefault();
    try {
      await verifyOtp(getEmail(), otp);
      feedback.success("Your OTP is verified!");
    } catch (err) {
      feedback.error(err.message);
    }
  }

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
          my={12}
          textAlign={"center"}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Verify your OTP
          </Heading>
          <Text
            fontSize={{ base: "sm", sm: "md" }}
            color={useColorModeValue("gray.800", "gray.400")}
          >
            An OTP has been sent to {getEmail()}
          </Text>
          <form onSubmit={handleOtpVerification}>
            <FormControl id="otp">
              <HStack justifyContent={"center"}>
                <PinInput type="number" onChange={setOtp} value={otp} size="lg">
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
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
                Verify OTP
              </Button>
            </Stack>
          </form>
          <Center>
            <Text
              cursor={"pointer"}
              _hover={{ textDecoration: "underline" }}
              color={"teal"}
              onClick={() => navigate("/")}
            >
              Request a new OTP
            </Text>
          </Center>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
};

export default VerifyOtp;
