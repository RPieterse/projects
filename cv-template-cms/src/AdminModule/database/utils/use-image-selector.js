export default function useImageSelector(key, suite, inputRef){

    function handleFileUpload(event){
        const file = event.target.files[0];
        if (file){
            suite.updateValue(key, URL.createObjectURL(file))
            suite.updateValue('file', file)
            inputRef.current.value = null;
        }
    }

    function openFileSelector(ref){
        ref.current?.click();
    }

    function removeImage(){
        suite.updateValue(key, '')
        suite.updateValue('file', '')
    }

    return {handleFileUpload, openFileSelector, removeImage}
}