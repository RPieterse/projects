import {useState} from "react";

export default function useSchemaManager(feature){
    const IDENTIFIER = `${feature}`;
    const [value, setValue] = useState({});
    const [updatedValue, setUpdatedValue] = useState({});
    function initialize(data){
        if (data){
            setValue(data);
            setUpdatedValue(data);
        }
    }

    function updateValue(name, data) {
        setUpdatedValue(p => {
            return {
                ...p,
                [name]: data
            }
        });
    }

    function getValue(name){
        if (updatedValue[name] !== value[name]) {
            return updatedValue[name];
        }
        return value[name];
    }

    function getOriginalValue(name){
        return value?.[name];
    }

    function resetValue(name, isFile) {
        if (isFile){
            setUpdatedValue({
                ...updatedValue,
                [name]: value[name] || '',
                file: value.file|| '',
                fileType: value.fileType || ''
            });
            return;
        }
        setUpdatedValue({
            ...updatedValue,
            [name]: value[name] || ''
        });
    }

    return { getValue, updateValue, resetValue, initialize, updatedValue, setValue, setUpdatedValue, value, getOriginalValue };
}