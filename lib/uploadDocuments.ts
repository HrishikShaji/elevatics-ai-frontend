import { DOCUMIND_INITIATE } from "./endpoints";

interface Props {
    selectedFiles: File[];
    conversationId: string;
}

export default async function uploadDocuments({ selectedFiles, conversationId }: Props) {
    const encodeFileToBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                if (reader.result) {
                    const base64String = (reader.result as string).split(',')[1];
                    resolve(base64String);
                } else {
                    reject(new Error('FileReader result is null.'));
                }
            };

            reader.onerror = (error) => {
                reject(new Error(`FileReader error: ${error}`));
            };
        });
    };


    const fileNames = [];
    const fileTypes = [];
    const fileData = [];

    for (const file of selectedFiles) {
        fileNames.push(file.name);
        fileTypes.push(file.type.split('/')[1]);
        const base64String = await encodeFileToBase64(file);
        fileData.push(base64String);
    }
    const data = {
        ConversationID: conversationId,
        FileNames: fileNames,
        FileTypes: fileTypes,
        FileData: fileData,
    };

    await fetch(DOCUMIND_INITIATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })

}
