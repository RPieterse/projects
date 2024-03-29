import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Button,
    Flex,
    FormLabel,
    Grid,
    GridItem, Input, Text, Textarea
} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import useLists from "../database/utils/use-lists";
import {useDatabase} from "../database/use-database";

export default function WorkHistoryAccordionForm({item, index}){
    const {workHistory} = useDatabase();
    const {removeItem, updateItem, addInnerItem, removeInnerItem, updateInnerItem} = useLists(workHistory, 'items');

    return <AccordionItem  key={item.id} >
        <AccordionButton >
            <FormLabel marginBlock={6}>Work History: {item.jobTitle ||'Unknown'} @{item.company || 'Unknown'} <Button as={'a'} cursor={'pointer'} position={'relative'} bottom={'2px'} marginLeft={2} size={'xs'} colorScheme={'accent'} onClick={() => removeItem(index)}>Remove</Button></FormLabel>
        </AccordionButton>
        <AccordionPanel pb={4}>
            <Flex  flexDirection={'column'} marginBottom={6}>
                {/*INPUTS*/}
                <Grid marginBottom={4} templateColumns='4fr 4fr' gap={6}>
                    <GridItem w='100%' h='10'>
                        <Input type="text" value={item.jobTitle} placeholder={'Job Title'} onChange={e => updateItem(index, 'jobTitle', e)}/>
                    </GridItem>
                    <GridItem w='100%' h='10'>
                        <Input type="text" value={item.company} placeholder={'Company'} onChange={e => updateItem(index, 'company', e)}/>
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
                <Input marginBottom={4} type="text" value={item.website} placeholder={'Website'} onChange={e => updateItem(index, 'website', e)}/>
                <Textarea type="text" value={item.description} placeholder={'Description'} onChange={e => updateItem(index, 'description', e)}/>

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