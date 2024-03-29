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
import WorkHistoryAccordionForm from "../../../components/work-history-accordion-form";
import {workHistoryItem} from "../../../constants";

function WorkHistory() {
    const {workHistory} = useDatabase();
    const {addItem} = useLists(workHistory, 'items', workHistoryItem);

    function updateOnDrop(fnc){
        workHistory.updateValue('items', fnc(workHistory.getValue('items')));
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            workHistory.save();
        }}>
            <Flex
                align={'center'}
                justify={'center'}
                flexDirection={'column'}>
                <Stack spacing={8}  width={'80%'}>
                    <Checkbox justifyContent={'right'} fontWeight={'bold'} isChecked={workHistory.getValue('hide')} onChange={() => workHistory.updateValue('hide', !workHistory.getValue('hide'))}>Hide Section</Checkbox>

                    <FormControl>
                        <FormLabel marginBottom={3}>
                            <Button size={'sm'} colorScheme={'accent'} onClick={addItem}><AddIcon marginRight={2}/> Add Work History</Button>
                            <Tooltip label={'Reset Work Experiences'} aria-label={'Reset References'}>
                                <Button marginLeft={3} size={'sm'} colorScheme={'accent'} variant={'outline'} onClick={() => workHistory.resetValue('items')}><RepeatIcon marginRight={2}/> Reset Work History</Button>
                            </Tooltip>
                        </FormLabel>
                        {(workHistory.getValue('items') || []).length > 0 ? <Accordion allowToggle >
                                <SortableList
                                    items={(workHistory.getValue('items') || [])}
                                    setItems={updateOnDrop}>
                                    {({ items }) => (
                                        <>
                                            {items.map((item, index) => (
                                                <SortableItem key={item.id} id={item.id} DragHandler={DragHandle}>
                                                    <WorkHistoryAccordionForm key={item.id} item={item} index={index}/>
                                                </SortableItem>
                                            ))}
                                        </>
                                    )}
                                </SortableList>
                            </Accordion> :
                            <Text marginTop={6}>No Work History Items</Text>}
                    </FormControl>
                </Stack>
                {(workHistory.getValue('items') || []).length > 0 && <Button marginBottom={24} type={'submit'} colorScheme={'accent'} marginTop={8} isLoading={workHistory.loading} onClick={workHistory.save}>
                    Save Work History
                </Button>}
            </Flex>
        </form>
    );
}

export default WorkHistory;
