const API_URL = process.env.NEXT_PUBLIC_API_URL;

// api.js
async function fetchFromApi(
  endpoint,
  method = 'GET',
  body = null,
  headers = {}
) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });

  const data = await response.json();

  if (
    !response.ok ||
    data.status === 'error' ||
    data.code?.toString()?.startsWith('4')
  ) {
    data['error'] = true;
  }

  return data;
}

export default fetchFromApi;
