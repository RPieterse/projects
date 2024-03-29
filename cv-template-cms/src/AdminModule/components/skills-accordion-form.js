import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Button,
    Flex,
    FormLabel,
    Grid,
    GridItem, Input, Select, Text, Textarea
} from "@chakra-ui/react";
import useLists from "../database/utils/use-lists";
import {useDatabase} from "../database/use-database";
import {skillLevel} from "../constants";

export default function SkillsAccordionForm({item, index}){
    const {skills} = useDatabase();
    const {removeItem, updateItem} = useLists(skills, 'items');

    return <AccordionItem  key={item.id} >
        <AccordionButton >
            <FormLabel marginBlock={6}>Skill: {item.name ||'Unknown'} <Button as={'a'} cursor={'pointer'} position={'relative'} bottom={'2px'} marginLeft={2} size={'xs'} colorScheme={'accent'} onClick={() => removeItem(index)}>Remove</Button></FormLabel>
        </AccordionButton>
        <AccordionPanel pb={4}>
            <Flex  flexDirection={'column'} marginBottom={6}>
                {/*INPUTS*/}
                <Grid marginBottom={4} templateColumns='4fr 4fr' gap={6}>
                    <GridItem w='100%' h='10'>
                        <Input type="text" value={item.name} placeholder={'Name'} onChange={e => updateItem(index, 'name', e)}/>
                    </GridItem>
                    <GridItem w='100%' h='10'>
                        <Select placeholder="Select option" value={item.level} onChange={e => updateItem(index, 'level', e)}>
                            {skillLevel.map((item, index) => <option key={index} value={item}>{item}</option>)}
                        </Select>
                    </GridItem>
                </Grid>
            </Flex>
        </AccordionPanel>
    </AccordionItem>
}