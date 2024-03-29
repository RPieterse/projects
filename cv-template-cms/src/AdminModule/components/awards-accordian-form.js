import {
    AccordionButton,
    AccordionItem,
    AccordionPanel, Box,
    Button,
    Flex,
    FormLabel,
    Grid,
    GridItem, IconButton, Input, Link, ListItem, Text, Textarea, Tooltip, UnorderedList
} from "@chakra-ui/react";
import {AddIcon, CloseIcon} from "@chakra-ui/icons";
import useLists from "../database/utils/use-lists";
import {useDatabase} from "../database/use-database";
import {useRef} from "react";

export default function AwardsAccordionForm({item, index}){
    const {awards} = useDatabase();
    const {removeItem, updateItem, addInnerItem, removeInnerItem, updateInnerItem} = useLists(awards, 'items');
    const filePickerRef = useRef();

    function openFilePicker(){
        filePickerRef.current.click();
    }

    function handleFileChange(e){
        const file = e.target.files[0];
        if(file){
            updateItem(index, 'file', file);
            filePickerRef.current.value = null;
        }
    }

    function removeFile(){
        updateItem(index, 'file', "");
    }

    return <AccordionItem  key={item.id} >
        <AccordionButton >
            <FormLabel marginBlock={6}>Award: {item.name ||'Unknown'} <Button as={'a'} cursor={'pointer'} position={'relative'} bottom={'2px'} marginLeft={2} size={'xs'} colorScheme={'accent'} onClick={() => removeItem(index)}>Remove</Button></FormLabel>
        </AccordionButton>
        <AccordionPanel pb={4}>
            <Flex  flexDirection={'column'} marginBottom={6}>
                {/*INPUTS*/}
                <Grid marginBottom={4} templateColumns='4fr 4fr' gap={6}>
                    <GridItem w='100%' h='10'>
                        <Input type="text" value={item.name} placeholder={'Award Name'} onChange={e => updateItem(index, 'name', e)}/>
                    </GridItem>
                    <GridItem w='100%' h='10'>
                        <Input type="text" value={item.institution} placeholder={'Institution'} onChange={e => updateItem(index, 'institution', e)}/>
                    </GridItem>
                </Grid>
                <Grid  marginBottom={4} templateColumns='4fr 4fr' gap={6}>
                    <GridItem w='100%' h='10'>
                        <Input type="text" value={item.startDate} placeholder={'Start Date'} onChange={e => updateItem(index, 'startDate', e)}/>
                    </GridItem>
                    <GridItem w='100%' h='10'>
                        <Input type="text" placeholder={'End Date'} value={item.endDate} onChange={e => updateItem(index, 'endDate', e)}/>
                    </GridItem>
                </Grid>
                <Input marginBottom={4} type="text" value={item.location} placeholder={'Location'} onChange={e => updateItem(index, 'location', e)}/>
                <Textarea type="text" value={item.description} placeholder={'Description'} onChange={e => updateItem(index, 'description', e)}/>

                <Box marginTop={6} marginBottom={4} style={{border: '1px solid #ececec', borderRadius: '12px'}} padding={4}>
                    <Flex alignItems={'center'} >
                        <Button mr={4} colorScheme={'accent'} onClick={openFilePicker}>{item.fileUrl ? 'Change File' : 'Upload' +
                            ' File'}</Button>
                        <Text>{item.file?.name}</Text>
                        {item.file && <Button marginLeft={4} size={'xs'} colorScheme={'accent'} onClick={removeFile}>Remove</Button>}
                        <input accept="application/pdf, image/*, movie/mp4" type={'file'} ref={filePickerRef} style={{display: 'none'}} onChange={handleFileChange}/>
                    </Flex>
                    {item.fileUrl && <UnorderedList marginTop={4}>
                        <ListItem>
                            <Link download href={item.fileUrl}>
                                Download your file</Link>
                            {!item.fileUrl?.includes('blob') && <Tooltip label={'Remove File'} aria-label={'Remove' +
                                ' File'}>
                                <IconButton ml={2} aria-label={'delete file'} size={'xs'} colorScheme={'accent'} onClick={()=> updateItem(index, 'fileUrl', '')} icon={<CloseIcon/>}/>
                            </Tooltip>}
                        </ListItem>
                    </UnorderedList>}
                </Box>

                {/*LIST OF ITEMS*/}
                <FormLabel marginBlock={3}>Items <Button position={'relative'} bottom={'2px'} marginLeft={2} size={'xs'} colorScheme={'accent'} onClick={() => addInnerItem(index)}><AddIcon/></Button></FormLabel>
                {(item.items || []).length > 0 ? (item.items || []).map((innerItem, innerIndex) => {
                        return <Flex key={innerItem.id} flexDirection={'row'} alignItems={'center'} marginBottom={6}>
                            <Input flex={1} type="text" value={innerItem.value} placeholder={'Item'} onChange={e => updateInnerItem(index, innerIndex, e)}/>
                            <Button position={'relative'} bottom={'2px'} marginLeft={2} size={'xs'} colorScheme={'accent'} onClick={() => removeInnerItem(index, innerIndex)}>Remove</Button>
                        </Flex> }) :
                    <Text marginTop={2}>No Items</Text>
                }
            </Flex>
        </AccordionPanel>
    </AccordionItem>
}