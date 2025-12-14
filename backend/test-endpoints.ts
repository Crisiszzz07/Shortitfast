import axios from "axios";

const BASE_URL = "http://localhost:3001";

const testEndpoints = async () => {
    try {
        console.log("Testing POST /shortitfast/postUrl...");
        const postRes = await axios.post(`${BASE_URL}/shortitfast/postUrl`, {
            url: "https://www.google.com"
        });
        console.log("POST Response:", postRes.data);

        if (postRes.data.shortUrl) {
            const shortUrl = postRes.data.shortUrl;
            const hash = shortUrl.split("/").pop();
            console.log(`Testing GET /shortitfast/${hash}...`);

            // Nota: el GET endpoint regresa un JSON, no un redirect en la implementación actual
            const getRes = await axios.get(`${BASE_URL}/shortitfast/${hash}`);
            console.log("GET Response:", getRes.data);
        }

    } catch (err: any) {
        console.error("Error testing endpoints:", err.message);
        if (err.response) {
            console.error("Response data:", err.response.data);
        }
    }
};

testEndpoints();
