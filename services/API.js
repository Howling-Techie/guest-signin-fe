const BASE_URL = "http://http://localhost:3000/api";

const headers = {
    "Content-Type": "application/json",
};

// Helper function for handling response
const handleResponse = (response) => {
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
};

// GET requests
const getGuests = (search) => {
    return fetch(`${BASE_URL}/guests${search ? "?name=" + search : ""}`, {headers})
        .then(handleResponse);
};

const getGuestById = (userId) => {
    return fetch(`${BASE_URL}/guests/${userId}`, {headers})
        .then(handleResponse);
};

// POST requests
const signGuestIn = (guestId, sessionData) => {
    return fetch(`${BASE_URL}/guests/${guestId}/signin`, {
        method: "POST",
        headers,
        body: JSON.stringify(sessionData),
    })
        .then((response) => {
            return response.json();
        });
};

const signGuestOut = (guestId, sessionData) => {
    return fetch(`${BASE_URL}/guests/${guestId}/signout`, {
        method: "POST",
        headers,
        body: JSON.stringify(sessionData),
    })
        .then(handleResponse);
};

export {
    getGuests,
    getGuestById,
    signGuestOut,
    signGuestIn
};