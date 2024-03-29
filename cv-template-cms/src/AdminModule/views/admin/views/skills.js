import {
    Accordion,
    Button, Checkbox,
    Flex, FormControl,
    FormLabel,
    Stack, Text, Tooltip
} from "@chakra-ui/react";
import {useDatabase} from "../../../database/use-database";
import {AddIcon, RepeatIcon} from "@chakra-ui/icons";
import useLists from "../../../database/utils/use-lists";
import {SortableItem, SortableList} from '@thaddeusjiang/react-sortable-list';
import '@thaddeusjiang/react-sortable-list/dist/index.css';
import DragHandle from "../../../components/drag-handle";
import SkillsAccordionForm from "../../../components/skills-accordion-form";

function Skills() {
    const {skills} = useDatabase();
    const {addItem} = useLists(skills, 'items', {name: '', level: ''});

    function updateOnDrop(fnc){
        skills.updateValue('items', fnc(skills.getValue('items')));
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            skills.save();
        }}>
            <Flex
                align={'center'}
                justify={'center'}
                flexDirection={'column'}>
                <Stack spacing={8}  width={'80%'}>
                    <Checkbox justifyContent={'right'} fontWeight={'bold'} isChecked={skills.getValue('hide')} onChange={() => skills.updateValue('hide', !skills.getValue('hide'))}>Hide Section</Checkbox>

                    <FormControl>
                        <FormLabel marginBottom={3}>
                            <Button size={'sm'} colorScheme={'accent'} onClick={addItem}><AddIcon marginRight={2}/> Add Skill</Button>
                            <Tooltip label={'Reset Skills'} aria-label={'Reset Skills'}>
                                <Button marginLeft={3} size={'sm'} colorScheme={'accent'} variant={'outline'} onClick={() => skills.resetValue('items')}><RepeatIcon marginRight={2}/> Reset Skills</Button>
                            </Tooltip>
                        </FormLabel>
                        {(skills.getValue('items') || []).length > 0 ? <Accordion allowToggle >
                                <SortableList
                                    items={(skills.getValue('items') || [])}
                                    setItems={updateOnDrop}>
                                    {({ items }) => (
                                        <>
                                            {items.map((item, index) => (
                                                <SortableItem key={item.id} id={item.id} DragHandler={DragHandle}>
                                                    <SkillsAccordionForm key={item.id} item={item} index={index}/>
                                                </SortableItem>
                                            ))}
                                        </>
                                    )}
                                </SortableList>
                            </Accordion> :
                            <Text marginTop={6}>No Skill Items</Text>}
                    </FormControl>
                </Stack>
                {(skills.getValue('items') || []).length > 0 && <Button marginBottom={24} type={'submit'} colorScheme={'accent'} marginTop={8} isLoading={skills.loading} onClick={skills.save}>
                    Save Skills
                </Button>}
            </Flex>
        </form>
    );
}

export default Skills;
