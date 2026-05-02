import axios from "axios";
import FormData from "form-data";

export async function uploadFiletoIpfs(file) {
    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);

     const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
            maxBodyLength: "Infinity",
            headers: {
                ...formData.getHeaders(),
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
            },
        }
    );

    const ipfsHash = res.data.IpfsHash;
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
}

export async function uploadMetadataToIPFS(metadata) {
    const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
            headers: {
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
            },
        }
    );

    const ipfsHash = res.data.IpfsHash;

    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
}
