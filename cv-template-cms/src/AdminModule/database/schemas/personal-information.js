import { useState } from "react";
import useSchemaManager from "../utils/use-schema-manager";
import useEntityManager from "../utils/use-entity-manager";
import { useToast } from "@chakra-ui/react";

export default function usePersonalInformation() {
	const {
		updatedValue,
		setValue,
		getValue,
		setUpdatedValue,
		updateValue,
		initialize,
		resetValue,
		value,
	} = useSchemaManager("personalInformation");
	const { uploadFile, save: saveEntity } = useEntityManager(
		"personalInformation"
	);
	const [loading, isLoading] = useState(false);
	const toast = useToast();

	function save() {
		isLoading(true);

		return saveEntity(
			updatedValue,
			async () => {
				if (updatedValue.file) {
					const profileImage = await uploadFile(
						updatedValue.file,
						"profileImage"
					);
					return {
						profileImage: profileImage || updatedValue.profileImage,
					};
				}
			},
			(dataToSave) => {
				if (dataToSave === "offline") {
					if (!toast.isActive("offline")) {
						toast({
							id: "offline",
							title: "You are offline",
							description:
								"You are currently offline. Please connect to the internet to continue",
							status: "warning",
							duration: 9000,
							isClosable: true,
						});
					}
				} else if (dataToSave) {
					setValue(dataToSave);
					setUpdatedValue(dataToSave);
				}
				isLoading(false);
			}
		);
	}

	return {
		getValue,
		updateValue,
		initialize,
		resetValue,
		save,
		loading,
		value,
	};
}
