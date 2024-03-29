import {useDatabase} from "../../../database/use-database";
import ImageUploader from "../../../components/image-uploader";
import {
    Button,
    Flex,
    FormControl, FormHelperText,
    FormLabel, Grid, GridItem, IconButton,
    Input,
    InputGroup,
    InputRightElement, Link,
    Stack,
    Textarea,
    Text, Tooltip, Checkbox
} from "@chakra-ui/react";
import {AddIcon, CloseIcon, RepeatIcon} from "@chakra-ui/icons";
import useLists from "../../../database/utils/use-lists";

function PersonalInformation() {
    const {personalInformation} = useDatabase();
    const {addItem, removeItem, updateItem} = useLists(personalInformation, 'socials', {
        url: '',
        icon: '',
    });

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            personalInformation.save();
        }}>
            <Flex
                align={'center'}
                justify={'center'}
                flexDirection={'column'}>
                <Stack spacing={8}  width={'80%'}>
                    <ImageUploader label={'Profile Image'} imageKey={'profileImage'} suite={personalInformation}/>
                    <FormControl>
                        <FormLabel>Bio</FormLabel>
                        <InputGroup size='md'>
                            <Textarea paddingRight={24} value={personalInformation.getValue('bio')} onChange={e => personalInformation.updateValue('bio', e.target.value)}/>
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={()=>personalInformation.resetValue('bio')}>
                                    Reset
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Full Name</FormLabel>
                        <InputGroup size='md'>
                            <Input paddingRight={24}  type="text" value={personalInformation.getValue('fullName')} onChange={e => personalInformation.updateValue('fullName', e.target.value)}/>
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={()=>personalInformation.resetValue('fullName')}>
                                    Reset
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Email Address</FormLabel>
                        <InputGroup size='md'>
                            <Input paddingRight={24}  type="email" value={personalInformation.getValue('emailAddress')} onChange={e => personalInformation.updateValue('emailAddress', e.target.value)}/>
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={()=>personalInformation.resetValue('emailAddress')}>
                                    Reset
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Contact Number</FormLabel>
                        <InputGroup size='md'>
                            <Input paddingRight={24}  type="tel" value={personalInformation.getValue('contactNumber')} onChange={e => personalInformation.updateValue('contactNumber', e.target.value)}/>
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={()=>personalInformation.resetValue('contactNumber')}>
                                    Reset
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Address</FormLabel>
                        <InputGroup size='md'>
                            <Textarea paddingRight={24} value={personalInformation.getValue('address')} onChange={e => personalInformation.updateValue('address', e.target.value)}/>
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={()=>personalInformation.resetValue('address')}>
                                    Reset
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Social Media
                            <Button position={'relative'} bottom={'2px'} marginLeft={2} size={'xs'} colorScheme={'accent'} onClick={addItem}><AddIcon/></Button>
                            <Tooltip label={'Reset Socials'} aria-label={'Reset Socials'}>
                                <Button position={'relative'} variant={'outline'} bottom={'2px'} marginLeft={2} size={'xs'} colorScheme={'accent'} onClick={() => personalInformation.resetValue('socials')}><RepeatIcon/></Button>
                            </Tooltip>
                        </FormLabel>
                        {(personalInformation.getValue('socials') || []).length > 0 && <FormHelperText marginBottom={6}>To get your icon codes, visit <Link fontWeight={'bold'} isExternal href={'https://fontawesome.com/search?o=r&m=free'}>FontAwesome</Link></FormHelperText>}
                        {(personalInformation.getValue('socials') || []).length > 0 ? <Flex flexDirection={'column'} size='md'>
                             {(personalInformation.getValue('socials') || []).map((item, index) => {
                                 return <Grid key={item.id} marginBottom={4} templateColumns='6fr 8fr 0.5fr' gap={6}>
                                     <GridItem w='100%' h='10'>
                                            <Input type="text" value={item.icon} placeholder={'Icon ex. fab' +
                                                ' fa-facebook'} onChange={e => updateItem(index, 'icon', e)}/>
                                        </GridItem>
                                     <GridItem w='100%' h='10'>
                                             <Input type="url" placeholder={'Social Url'} value={item.url} onChange={e => updateItem(index, 'url', e)}/>
                                     </GridItem>
                                     <GridItem w='100%' h='10'>
                                         <Flex justifyContent={'center'} alignItems={'center'} height={'100%'}>
                                             <IconButton colorScheme={'accent'} size={'xs'} aria-label={'delete' +
                                                 ' social'} icon={<CloseIcon/>} onClick={()=> removeItem(index)}></IconButton>
                                         </Flex>
                                     </GridItem>
                                </Grid>})}
                            </Flex> :
                            <Text marginTop={6}>No Social Items</Text>}
                    </FormControl>
                </Stack>
                <Button marginBottom={24} type={'submit'} colorScheme={'accent'} marginTop={8} isLoading={personalInformation.loading} onClick={personalInformation.save}>
                    Save Personal Information
                </Button>
            </Flex>
        </form>
    );
}

export default PersonalInformation;
