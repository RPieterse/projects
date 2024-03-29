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
import ReferencesAccordionForm from "../../../components/references-accordion-form";
import {referenceItem} from "../../../constants";

function References() {
    const {references} = useDatabase();
    const {addItem} = useLists(references, 'items', referenceItem);

    function updateOnDrop(fnc){
        references.updateValue('items', fnc(references.getValue('items')));
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            references.save();
        }}>
            <Flex
                align={'center'}
                justify={'center'}
                flexDirection={'column'}>
                <Stack spacing={8}  width={'80%'}>
                    <Checkbox justifyContent={'right'} fontWeight={'bold'} isChecked={references.getValue('hide')} onChange={() => references.updateValue('hide', !references.getValue('hide'))}>Hide Section</Checkbox>

                    <FormControl>
                        <FormLabel marginBottom={3}>
                            <Button size={'sm'} colorScheme={'accent'} onClick={addItem}><AddIcon marginRight={2}/> Add Reference</Button>
                            <Tooltip label={'Reset References'} aria-label={'Reset References'}>
                                <Button marginLeft={3} size={'sm'} colorScheme={'accent'} variant={'outline'} onClick={() => references.resetValue('items')}><RepeatIcon marginRight={2}/> Reset References</Button>
                            </Tooltip>
                        </FormLabel>
                        {(references.getValue('items') || []).length > 0 ? <Accordion allowToggle >
                                <SortableList
                                    items={(references.getValue('items') || [])}
                                    setItems={updateOnDrop}>
                                    {({ items }) => (
                                        <>
                                            {items.map((item, index) => (
                                                <SortableItem key={item.id} id={item.id} DragHandler={DragHandle}>
                                                    <ReferencesAccordionForm key={item.id} item={item} index={index}/>
                                                </SortableItem>
                                            ))}
                                        </>
                                    )}
                                </SortableList>
                            </Accordion> :
                            <Text marginTop={6}>No Reference Items</Text>}
                    </FormControl>
                </Stack>
                {(references.getValue('items') || []).length > 0 && <Button marginBottom={24} type={'submit'} colorScheme={'accent'} marginTop={8} isLoading={references.loading} onClick={references.save}>
                    Save References
                </Button>}
            </Flex>
        </form>
    );
}

export default References;
