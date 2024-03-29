import uniqid from "uniqid";

export default function useLists(suite, key, schema = {}){
    function updateItem(index, path, e){
        const updatedValues = (suite.getValue(key) || []).map((item, idx) => {
            if (idx === index) {
                if (path === 'file'){
                    return {
                        ...item,
                        [path]: e,
                        fileUrl: e ? URL.createObjectURL(e) : suite.getOriginalValue(key)[index].fileUrl
                    }
                    if (!e) {
                        URL.revokeObjectURL(e);
                    }
                }else{
                    return {
                        ...item,
                        [path]: e?.target?.value || (e?.target?.value === '' ? '' :  e)
                    }
                }
            }else{
                return item;
            }
        });
        suite.updateValue(key, updatedValues)
    }

    function removeItem(index){
        const data = [...(suite.getValue(key) || [])];
        if(data[index]) {
            data.splice(index, 1);
            suite.updateValue(key, data)
        }
    }

    function addItem(){
        suite.updateValue(key,
            [...(suite.getValue(key) || []), {...schema, id: uniqid()}])
    }

    function addInnerItem(index){
        if (suite.getValue(key)[index].items === undefined) {
            suite.getValue(key)[index].items = [];
        }
        updateItem(index, key, [...(suite.getValue(key)[index].items || []), {value: '', id: uniqid()}])
    }

    function removeInnerItem(index, innerIndex){
        const items = suite.getValue(key)[index].items || [];
        if(items[innerIndex] !== undefined) {
            items.splice(innerIndex, 1);
            updateItem(index, key, items)
        }
    }

    function updateInnerItem(index, innerIndex, e){
        const items = suite.getValue(key)[index].items || [];
        const updatedValues = items.map((item, idx) => {
            if (idx === innerIndex) {
                return {
                    ...item,
                    value: e?.target?.value || (e?.target?.value === '' ? '' :  e)
                }
            }
            return item;
        });
        updateItem(index, key, updatedValues)
    }

    return {updateItem, removeItem, addItem, addInnerItem, removeInnerItem, updateInnerItem}
}