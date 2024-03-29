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
import LanguageAccordionForm from "../../../components/language-accordion-form";

function Languages() {
    const {languages} = useDatabase();
    const {addItem} = useLists(languages, 'items', {name: '', level: ''});
    function updateOnDrop(fnc){
        languages.updateValue('items', fnc(languages.getValue('items')));
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            languages.save();
        }}>
            <Flex
                align={'center'}
                justify={'center'}
                flexDirection={'column'}>
                <Stack spacing={8}  width={'80%'}>
                    <Checkbox justifyContent={'right'} fontWeight={'bold'} isChecked={languages.getValue('hide')} onChange={() => languages.updateValue('hide', !languages.getValue('hide'))}>Hide Section</Checkbox>

                    <FormControl>
                        <FormLabel marginBottom={3}>
                            <Button size={'sm'} colorScheme={'accent'} onClick={addItem}><AddIcon marginRight={2}/> Add Language</Button>
                            <Tooltip label={'Reset Languages'} aria-label={'Reset Languages'}>
                                <Button marginLeft={3} size={'sm'} colorScheme={'accent'} variant={'outline'} onClick={() => languages.resetValue('items')}><RepeatIcon marginRight={2}/> Reset Language</Button>
                            </Tooltip>
                        </FormLabel>
                        {(languages.getValue('items') || []).length > 0 ? <Accordion allowToggle >
                                <SortableList
                                    items={(languages.getValue('items') || [])}
                                    setItems={updateOnDrop}>
                                    {({ items }) => (
                                        <>
                                            {items.map((item, index) => (
                                                <SortableItem key={item.id} id={item.id} DragHandler={DragHandle}>
                                                    <LanguageAccordionForm key={item.id} item={item} index={index}/>
                                                </SortableItem>
                                            ))}
                                        </>
                                    )}
                                </SortableList>
                            </Accordion> :
                            <Text marginTop={6}>No Language Items</Text>}
                    </FormControl>
                </Stack>
                {(languages.getValue('items') || []).length > 0 && <Button marginBottom={24} type={'submit'} colorScheme={'accent'} marginTop={8} isLoading={languages.loading} onClick={languages.save}>
                    Save Languages
                </Button>}
            </Flex>
        </form>
    );
}

export default Languages;
