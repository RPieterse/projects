import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack
} from "@chakra-ui/react";
import {useDatabase} from "../../../database/use-database";
import {Icon} from "@chakra-ui/icons";
import ImageUploader from "../../../components/image-uploader";
import {colorSchemes} from "../../../constants";

const CircleIcon = (props) => (
    <Icon viewBox='0 0 200 200' {...props}>
        <path
            fill='currentColor'
            d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
        />
    </Icon>
)

function General() {
    const {general} = useDatabase()

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            general.save();
        }}>
            <Flex
            align={'center'}
            justify={'center'}
            flexDirection={'column'}>
                <Stack spacing={8}  width={'80%'}>
                    <ImageUploader label={'Favicon'} imageKey={'favicon'} suite={general}/>
                    <FormControl id="pageTitle">
                        <FormLabel>Page Title</FormLabel>
                        <InputGroup size='md'>
                            <Input paddingRight={24} type="text" value={general.getValue('pageTitle')} onChange={e => general.updateValue('pageTitle', e.target.value)}/>
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={()=>general.resetValue('pageTitle')}>
                                    Reset
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl id="accentColor">
                        <FormLabel>Accent Color</FormLabel>
                        <Flex justifyContent={'space-around'}>
                            {colorSchemes.map((color, idx) => {
                                return <CircleIcon
                                    key={color}
                                    cursor={'pointer'}
                                    onClick={() => general.updateValue('accentColor', color)}
                                    boxSize={12}
                                    color={color}
                                    border={general.getValue('accentColor') === color ? '3px solid black' : ''}
                                    borderRadius={'50%'}/>
                            })}
                        </Flex>
                    </FormControl>
                </Stack>
                <Button marginBottom={24} type={'submit'} colorScheme={'accent'} marginTop={8} isLoading={general.loading} onClick={general.save}>
                    Save General
                </Button>
            </Flex>
        </form>
    );
}

export default General;
