const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const fetchData = async (
  endpoint,
  method = "GET",
  body = null,
  headers = {}
) => {
  try {
    const response = await fetch(`${BASE_URL}/api/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

export default fetchData;
