const BASE_URL = "http://localhost:3000/api";

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

const getActiveSessions = () => {
    return fetch(`${BASE_URL}/sessions/active`, {headers})
        .then(handleResponse);
};

// POST requests
const signGuestIn = (sessionData) => {
    return fetch(`${BASE_URL}/sessions/signin`, {
        method: "POST",
        headers,
        body: JSON.stringify(sessionData),
    })
        .then((response) => {
            return response.json();
        });
};

const signGuestOut = (sessionId, sessionData) => {
    return fetch(`${BASE_URL}/sessions/signout/${sessionId}`, {
        method: "POST",
        headers,
        body: JSON.stringify(sessionData),
    })
        .then(handleResponse);
};

const createGuest = (guestData) => {
    return fetch(`${BASE_URL}/guests/`, {
        method: "POST",
        headers,
        body: JSON.stringify(guestData),
    })
        .then(handleResponse);
};

export {
    getGuests,
    getGuestById,
    signGuestOut,
    signGuestIn,
    createGuest,
    getActiveSessions
};