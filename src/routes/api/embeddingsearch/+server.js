import { WORDMATH_API_KEY } from '$env/static/private';
import { error, json } from '@sveltejs/kit';

async function getErrorResponse(response) {
  try {
    const errorData = await response.json();
    return errorData.error || "Unknown error";
  } catch {
    return "Unknown error";
  }
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  let query = url.searchParams.get("query");
  let model = url.searchParams.get("model");
  // If query or model isn't provided, we won't make the API call.
  let errors = [];
  if (!query) {
    errors.push("query is required");
  }
  if (!model) {
    errors.push("model is required");
  }
  if (errors.length > 0) {
    throw error(400, errors.join(", "));
  }

  // Ensure the provided query and model are URL-encoded
  const encodedQuery = encodeURIComponent(query);
  const encodedModel = encodeURIComponent(model);

  const endpoint = `https://0aum8r5hl5.execute-api.us-west-1.amazonaws.com/dev/search?query=${encodedQuery}&model=${encodedModel}`;
  let response = undefined;
  try {
    response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": WORDMATH_API_KEY,
      }
    });
  } catch (err) {
    throw error(400);
  }

  if (!response || !response.ok) {
    const errorMessage = await getErrorResponse(response);
    throw error(400, {
      message: errorMessage
    });
  }
  try {
    const data = await response.json();
    return json({
      headers: {
        'cache-control': 'public, max-age=60'
      },
      body: data
    });

  } catch (err) {
    throw error(400);
  }
}