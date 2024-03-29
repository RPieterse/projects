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
import ProjectsAccordionForm from "../../../components/projects-accordian-form";
import {projectItem} from "../../../constants";

function Projects() {
    const {projects} = useDatabase();
    const {addItem} = useLists(projects, 'items', projectItem);

    function updateOnDrop(fnc){
        projects.updateValue('items', fnc(projects.getValue('items')));
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            projects.save();
        }}>
            <Flex
                align={'center'}
                justify={'center'}
                flexDirection={'column'}>
                <Stack spacing={8}  width={'80%'}>
                    <Checkbox justifyContent={'right'} fontWeight={'bold'} isChecked={projects.getValue('hide')} onChange={() => projects.updateValue('hide', !projects.getValue('hide'))}>Hide Section</Checkbox>

                    <FormControl>
                        <FormLabel marginBottom={3}>
                            <Button size={'sm'} colorScheme={'accent'} onClick={addItem}><AddIcon marginRight={2}/> Add Project</Button>
                            <Tooltip label={'Reset Projects'} aria-label={'Reset Projects'}>
                                <Button marginLeft={3} size={'sm'} colorScheme={'accent'} variant={'outline'} onClick={() => projects.resetValue('items')}><RepeatIcon marginRight={2}/> Reset Projects</Button>
                            </Tooltip>
                        </FormLabel>
                        {(projects.getValue('items') || []).length > 0 ? <Accordion allowToggle >
                                <SortableList
                                    items={(projects.getValue('items') || [])}
                                    setItems={updateOnDrop}>
                                    {({ items }) => (
                                        <>
                                            {items.map((item, index) => (
                                                <SortableItem key={item.id} id={item.id} DragHandler={DragHandle}>
                                                    <ProjectsAccordionForm key={item.id} item={item} index={index}/>
                                                </SortableItem>
                                            ))}
                                        </>
                                    )}
                                </SortableList>
                            </Accordion> :
                            <Text marginTop={6}>No Projects Items</Text>}
                    </FormControl>
                </Stack>
                {(projects.getValue('items') || []).length > 0 && <Button marginBottom={24} type={'submit'} colorScheme={'accent'} marginTop={8} isLoading={projects.loading} onClick={projects.save}>
                    Save Projects
                </Button>}
            </Flex>
        </form>
    );
}

export default Projects;
