import { url } from "../constants";

const checkAdminToken = async (token, profileId) => {
    const response = await fetch(`${url}/admin/checkToken`, {
      method: "POST",
      headers: {
        authorization: token,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        profileId,
      }),
    });
    const jsonResponse = await response.json();
    return { response, jsonResponse };
  };

  export default checkAdminToken;