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
import EducationAccordionForm from "../../../components/education-accordion-form";
import {SortableItem, SortableList} from '@thaddeusjiang/react-sortable-list';
import '@thaddeusjiang/react-sortable-list/dist/index.css';
import DragHandle from "../../../components/drag-handle";
import {educationItem} from "../../../constants";

function Education() {
    const {education} = useDatabase();
    const {addItem} = useLists(education, 'items', educationItem);

    function updateOnDrop(fnc){
        education.updateValue('items', fnc(education.getValue('items')));
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            education.save();
        }}>
            <Flex
                align={'center'}
                justify={'center'}
                flexDirection={'column'}>
                 <Stack spacing={8}  width={'80%'}>
                     <Checkbox justifyContent={'right'} fontWeight={'bold'} isChecked={education.getValue('hide')} onChange={() => education.updateValue('hide', !education.getValue('hide'))}>Hide Section</Checkbox>

                   <FormControl>
                        <FormLabel marginBottom={3}>
                            <Button size={'sm'} colorScheme={'accent'} onClick={addItem}><AddIcon marginRight={2}/> Add Education</Button>
                            <Tooltip label={'Reset Education'} aria-label={'Reset Education'}>
                                <Button marginLeft={3} size={'sm'} colorScheme={'accent'} variant={'outline'} onClick={() => education.resetValue('items')}><RepeatIcon marginRight={2}/> Reset Education</Button>
                            </Tooltip>
                        </FormLabel>
                       {(education.getValue('items') || []).length > 0 ? <Accordion allowToggle >
                               <SortableList
                                   items={(education.getValue('items') || [])}
                                   setItems={updateOnDrop}>
                                   {({ items }) => (
                                       <>
                                           {items.map((item, index) => (
                                               <SortableItem key={item.id} id={item.id} DragHandler={DragHandle}>
                                                   <EducationAccordionForm key={item.id} item={item} index={index}/>
                                               </SortableItem>
                                           ))}
                                       </>
                                   )}
                               </SortableList>
                           </Accordion> :
                           <Text marginTop={6}>No Education Items</Text>}
                    </FormControl>
                </Stack>
                {(education.getValue('items') || []).length > 0 && <Button marginBottom={24} type={'submit'} colorScheme={'accent'} marginTop={8} isLoading={education.loading} onClick={education.save}>
                    Save Education
                </Button>}
            </Flex>
        </form>
    );
}

export default Education;
