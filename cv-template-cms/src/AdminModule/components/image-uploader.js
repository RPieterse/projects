import {
    Avatar,
    AvatarBadge,
    Button,
    Center,
    FormControl,
    FormLabel,
    IconButton,
    Stack,
    Tooltip
} from "@chakra-ui/react";
import {RepeatIcon, SmallCloseIcon} from "@chakra-ui/icons";
import {useRef} from "react";
import useImageSelector from "../database/utils/use-image-selector";

export default function ImageUploader({label, imageKey, suite}){
    const inputRef = useRef();
    const {handleFileUpload, openFileSelector, removeImage} = useImageSelector(imageKey, suite, inputRef)

    return <FormControl>
        <FormLabel>{label}</FormLabel>
        <Stack direction={['column', 'row']} spacing={6}>
            <Center>
                {suite.getValue(imageKey) ? <Avatar loading={'lazy'} size="xl" src={suite.getValue(imageKey)}>
                        {suite.getValue(imageKey) && <AvatarBadge
                            as={IconButton}
                            size="sm"
                            rounded="full"
                            top="-10px"
                            colorScheme="red"
                            aria-label="remove Image"
                            icon={<SmallCloseIcon onClick={removeImage} />}/> }
                    </Avatar> :
                    <Avatar size="xl" src={'/no-image.png'}/>}
            </Center>
            <Center >
                <Button colorScheme={'accent'} onClick={() => openFileSelector(inputRef)} w="full">Change Image</Button>
                <Tooltip label={'Reset Image'} aria-label={'Reset Image'}>
                    <Button position={'relative'} variant={'outline'} marginLeft={2}  colorScheme={'accent'} onClick={() => suite.resetValue(imageKey, true)}><RepeatIcon/></Button>
                </Tooltip>
                <input accept="image/*" ref={inputRef} onChange={handleFileUpload} type={"file"} hidden/>
            </Center>
        </Stack>
    </FormControl>
}