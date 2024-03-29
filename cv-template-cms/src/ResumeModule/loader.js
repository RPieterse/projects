import { Box, Center, Heading } from "@chakra-ui/react";

export default function Loader() {
  return (
    <Box
      backgroundColor={"rgb(47, 50, 56)"}
      height={"100vh"}
      width={"100vw"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Center>
        <Heading as={"h1"} color={"white"} size={"2xl"}>
          Just fixing my hair...
        </Heading>
      </Center>
    </Box>
  );
}
