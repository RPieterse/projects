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
import useLists from "../database/utils/use-lists";
import {useDatabase} from "../database/use-database";

export default function ReferencesAccordionForm({item, index}){
    const {references} = useDatabase();
    const {removeItem, updateItem} = useLists(references, 'items');


    return <AccordionItem  key={item.id} >
        <AccordionButton >
            <FormLabel marginBlock={6}>Reference: {item.name ||'Unknown'} <Button as={'a'} cursor={'pointer'} position={'relative'} bottom={'2px'} marginLeft={2} size={'xs'} colorScheme={'accent'} onClick={() => removeItem(index)}>Remove</Button></FormLabel>
        </AccordionButton>
        <AccordionPanel pb={4}>
            <Flex  flexDirection={'column'} marginBottom={6}>
                {/*INPUTS*/}
                <Grid marginBottom={4} templateColumns='4fr 4fr' gap={6}>
                    <GridItem w='100%' h='10'>
                        <Input type="text" value={item.name} placeholder={'Name'} onChange={e => updateItem(index, 'name', e)}/>
                    </GridItem>
                    <GridItem w='100%' h='10'>
                        <Input type="text" value={item.position} placeholder={'Position'} onChange={e => updateItem(index, 'position', e)}/>
                    </GridItem>
                </Grid>
                <Grid  marginBottom={4} templateColumns='4fr 4fr' gap={6}>
                    <GridItem w='100%' h='10'>
                        <Input type="text" value={item.company} placeholder={'Company'} onChange={e => updateItem(index, 'company', e)}/>
                    </GridItem>
                    <GridItem w='100%' h='10'>
                        <Input type="tel" placeholder={'Phone'} value={item.phone} onChange={e => updateItem(index, 'phone', e)}/>
                    </GridItem>
                </Grid>
                <Input marginBottom={4} type="email" value={item.email} placeholder={'Email Address'} onChange={e => updateItem(index, 'email', e)}/>
            </Flex>
        </AccordionPanel>
    </AccordionItem>
}