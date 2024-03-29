import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {db, storage} from "../index";
import {useToast} from "@chakra-ui/react";
import {doc, getDoc, setDoc} from "firebase/firestore";

export default function useEntityManager(feature){
    const IDENTIFIER = `${feature}`;
    const toast = useToast();

    const uploadFile = async (file, filename) => {
        return new Promise((resolve) => {
            const storageRef = ref(storage, `${filename}.${file.type.split('/').pop()}`);
            uploadBytes(storageRef, file).then(() => {
                getDownloadURL(storageRef).then((url) => {
                    resolve(url);
                }).catch((error) => {
                    toast({
                        title: "Oops! Something went wrong",
                        description: error.message,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    })
                    resolve('');
                });
            }).catch((error) => {
                toast({
                    title: "Oops! Something went wrong",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
                resolve('');
            });
        });
    }

    async function save(updatedValue, pre, callback){
        if (!navigator.onLine) return callback('offline')
        let dataToSave = {
            ...updatedValue,
        }

        const docRef = doc(db, "profile", "data");

        // upload image if new one is selected
        if (typeof pre === 'function'){
            const response = await pre();
            if (response) {
                dataToSave = {
                    ...dataToSave,
                    ...response
                }
            }
        }

        delete dataToSave.file;

        // get current doc
        getDoc(docRef).then((doc) => {
            // update doc
            setDoc(docRef, {
                ...doc?.data(),
                [IDENTIFIER]: dataToSave
            }).then(() => {
                callback(dataToSave);
                if (!toast.isActive('success-toast')){
                    toast({
                        id:'success-toast',
                        title: "Success",
                        description: "Information has been updated",
                        status: "success",
                    })
                }
            }).catch((error) => {
                if (!toast.isActive('error-toast')) {
                    toast({
                        id: 'error-toast',
                        title: "Oops! Something went wrong",
                        description: error.message,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    })
                }
                callback();
            })
        });
    }


    return { uploadFile, save };
}