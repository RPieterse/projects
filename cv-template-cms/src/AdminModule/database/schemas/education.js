import { useState } from "react";
import useSchemaManager from "../utils/use-schema-manager";
import useEntityManager from "../utils/use-entity-manager";
import uniqid from "uniqid";
import { useToast } from "@chakra-ui/react";

export default function useEducation() {
	const {
		updatedValue,
		setValue,
		setUpdatedValue,
		getValue,
		updateValue,
		initialize,
		value,
		resetValue,
		getOriginalValue,
	} = useSchemaManager("education");
	const { save: saveEntity, uploadFile } = useEntityManager("education");
	const [loading, isLoading] = useState(false);
	const toast = useToast();

	function save() {
		isLoading(true);

		return saveEntity(
			updatedValue,
			async () => {
				// upload all files
				const promises = [];
				if (
					Array.isArray(updatedValue.items) &&
					updatedValue.items.length > 0
				) {
					updatedValue.items.forEach((item) => {
						promises.push(
							new Promise((res) => {
								if (item.file) {
									res(
										uploadFile(
											item.file,
											item.file?.name?.split(".")[0] ||
												uniqid()
										)
									);
								} else {
									res("");
								}
							})
						);
					});
					const results = await Promise.all(promises);
					return {
						items: updatedValue.items.map((item, index) => {
							if (item.file) {
								const fileType =
									item.file?.type || item.fileType;
								delete item.file;
								return {
									...item,
									fileUrl: results[index] || item.fileUrl,
									fileType,
								};
							} else {
								return item;
							}
						}),
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
		getOriginalValue,
	};
}
