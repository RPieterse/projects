import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    IconButton, useToast,
} from '@chakra-ui/react';
import {ArrowBackIcon} from "@chakra-ui/icons";
import {useState} from "react";
import {auth} from "../../../database";
import {signInWithEmailAndPassword, sendPasswordResetEmail, getAuth} from 'firebase/auth'

export default function Login({onClose}) {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })
    const [view, setView] = useState('login')
    const [loading, isLoading] = useState(false)
    const toast = useToast();

    function login(){
        isLoading(true)
        signInWithEmailAndPassword(getAuth(), credentials.email, credentials.password).then(() => {
            toast({
                id:'success-toast',
                title: "Success",
                description: "Logged in successfully",
                status: "success",
            })
        }).catch(err => {
            if (!navigator.onLine){
                if (!toast.isActive('offline')) {
                    toast({
                        id: 'offline',
                        title: "You are offline",
                        description: "You are currently offline. Please connect to the internet to continue",
                        status: "warning",
                        duration: 9000,
                        isClosable: true,
                    })
                }
            }else{
                toast({
                    title: 'Oops! Something went wrong',
                    description: err.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            }
        }).finally(() => {
            isLoading(false);
        });
    }

    function sendForgotPasswordEmail(){
        isLoading(true)
        sendPasswordResetEmail(getAuth(), credentials.email, credentials.password).then(() => {
            toast({
                id:'success-toast',
                title: "Success",
                description: "Password reset email sent successfully",
                status: "success",
            })
        }).catch(err => {
            if (!navigator.onLine){
                if (!toast.isActive('offline')) {
                    toast({
                        id: 'offline',
                        title: "You are offline",
                        description: "You are currently offline. Please connect to the internet to continue",
                        status: "warning",
                        duration: 9000,
                        isClosable: true,
                    })
                }
            }else{
                toast({
                    title: 'Oops! Something went wrong',
                    description: err.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            }
        }).finally(() => {
            isLoading(false);
        })
    }

    function changeView(){
        if (view === 'login'){
            return setView('forgot-password')
        }
        return setView('login')
    }

    function updateEmail(e){
       return setCredentials(p => {
           return {
               ...p,
               email: e.target.value
           }
       })
    }

    function updatePassword(e){
        return setCredentials(p => {
            return {
                ...p,
                password: e.target.value
            }
        })
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} >
                <Stack align={'center'}>
                    <Flex className={'title'}>
                        <IconButton
                            fontSize={'28px'}
                            variant={'ghost'}
                            marginRight={6}
                            aria-label={'Back'}
                            icon={<ArrowBackIcon/>}
                            onClick={onClose} />
                    <Heading fontSize={'4xl'}>{view === 'login' ? 'Sign in to your account' : 'Forgot your password'}</Heading>
                    </Flex>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        {view === 'login' ? <span>to enjoy all of your cool <Link color={"blue.400"}>features</Link> ✌️</span> : 'You will receive an email to reset you password'}
                    </Text>
                </Stack>
                <Box
                    rounded={'lg'}>
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" onChange={updateEmail}/>
                        </FormControl>
                        {view === 'login' && <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" onChange={updatePassword}/>
                        </FormControl>}
                        <Stack spacing={10}>
                            {view === 'login' && <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'end'}>
                                <Link color={'blue.400'} onClick={changeView}>Forgot password?</Link>
                            </Stack>}
                            {view !== 'login' && <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'end'}>
                                <Link color={'blue.400'} onClick={changeView}>Remember password?</Link>
                            </Stack>}
                            {view === 'login' && <Button
                                isLoading={loading}
                                onClick={login}
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Sign in
                            </Button>}
                            {view !== 'login' && <Button
                                isLoading={loading}
                                onClick={sendForgotPasswordEmail}
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Send Reset Link
                            </Button>}
                        </Stack>
                    </Stack>
                </Box>
            </Stack>

        </Flex>
    );
}