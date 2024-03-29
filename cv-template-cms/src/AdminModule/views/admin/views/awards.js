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
import AwardsAccordionForm from "../../../components/awards-accordian-form";
import {awardItem} from "../../../constants";

function Awards() {
    const {awards} = useDatabase();
    const {addItem} = useLists(awards, 'items', awardItem);

    function updateOnDrop(fnc){
        awards.updateValue('items', fnc(awards.getValue('items')));
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            awards.save();
        }}>
            <Flex
                align={'center'}
                justify={'center'}
                flexDirection={'column'}>
                <Stack spacing={8}  width={'80%'}>
                    <Checkbox justifyContent={'right'} fontWeight={'bold'} isChecked={awards.getValue('hide')} onChange={() => awards.updateValue('hide', !awards.getValue('hide'))}>Hide Section</Checkbox>

                    <FormControl>
                        <FormLabel marginBottom={3}>
                            <Button size={'sm'} colorScheme={'accent'} onClick={addItem}><AddIcon marginRight={2}/> Add Award</Button>
                            <Tooltip label={'Reset Awards'} aria-label={'Reset Awards'}>
                                <Button marginLeft={3} size={'sm'} colorScheme={'accent'} variant={'outline'} onClick={() => awards.resetValue('items')}><RepeatIcon marginRight={2}/> Reset Awards</Button>
                            </Tooltip>
                        </FormLabel>
                        {(awards.getValue('items') || []).length > 0 ? <Accordion allowToggle >
                                <SortableList
                                    items={(awards.getValue('items') || [])}
                                    setItems={updateOnDrop}>
                                    {({ items }) => (
                                        <>
                                            {items.map((item, index) => (
                                                <SortableItem key={item.id} id={item.id} DragHandler={DragHandle}>
                                                    <AwardsAccordionForm key={item.id} item={item} index={index}/>
                                                </SortableItem>
                                            ))}
                                        </>
                                    )}
                                </SortableList>
                            </Accordion> :
                            <Text marginTop={6}>No Awards Items</Text>}
                    </FormControl>
                </Stack>
                {(awards.getValue('items') || []).length > 0 && <Button marginBottom={24} type={'submit'} colorScheme={'accent'} marginTop={8} isLoading={awards.loading} onClick={awards.save}>
                    Save Awards
                </Button>}
            </Flex>
        </form>
    );
}

export default Awards;
