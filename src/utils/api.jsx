import { jwtStorage } from "./jwt_storage";

const REACT_APP_API_URL = import.meta.env.VITE_REACT_APP_API_URL;

// Kirim data publik tanpa token (misalnya login, kontak, dll)
export const sendData = async (url, data) => {
  return fetch(REACT_APP_API_URL + url, {
    method: "POST",
    body: data,
  })
    .then((response) =>
      response.status >= 200 &&
      response.status <= 299 &&
      response.status !== 204
        ? response.json()
        : response
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};

// Ambil data user (butuh token, misalnya profil)
export const getDataPrivate = async (url) => {
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) =>
      response.status >= 200 &&
      response.status <= 299 &&
      response.status !== 204
        ? response.json()
        : response
    )
    .then((data) => data)
    .catch((err) => {
      throw err;
    });
};

// Kirim data privat (POST dengan token)
export const sendDataPrivate = async (url, data) => {
  let token = await jwtStorage.retrieveToken();
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  if (data) {
    options.body = data;
  }

  return fetch(REACT_APP_API_URL + url, options)
    .then((response) =>
      response.status === 401
        ? { isExpiredJWT: true }
        : response.status >= 200 &&
            response.status <= 299 &&
            response.status !== 204
          ? response.json()
          : response
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};

// Edit data user via PUT dan JSON (butuh token)
export const editDataPrivatePut = async (url, data) => {
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) =>
      response.status === 401
        ? { isExpiredJWT: true }
        : response.status >= 200 &&
            response.status <= 299 &&
            response.status !== 204
          ? response.json()
          : response
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};

// Hapus data user dengan metode DELETE dan format JSON
export const deleteDataPrivateJSON = async (url, data) => {
  let token = await jwtStorage.retrieveToken();
  return fetch(REACT_APP_API_URL + url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((response) =>
      response.status === 401
        ? { isExpiredJWT: true }
        : response.status >= 200 &&
            response.status <= 299 &&
            response.status !== 204
          ? response.json()
          : response
    )
    .then((data) => data)
    .catch((err) => console.log(err));
};

// Logout user dan hapus token JWT
export const logoutAPI = async () => {
  let token = await jwtStorage.retrieveToken();
  let formData = new FormData();
  formData.append("logout", "Logout");
  return fetch(REACT_APP_API_URL + "/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (response.status === 200) {
        jwtStorage.removeItem();
        return { isLoggedOut: true };
      } else {
        console.error("Logout failed:", response.statusText);
        return false;
      }
    })
    .catch((error) => {
      console.error("Logout error:", error);
      return false;
    });
};

// Ambil gambar user, default jika null
export const getImage = (url_image) => {
  const imgDefault = "/storage/images/userpng_1717846018.png";
  let imgResult = url_image ? url_image : imgDefault;
  return REACT_APP_API_URL + imgResult;
};

// Registrasi user
export const registerUser = async (formData) => {
  return fetch(REACT_APP_API_URL + "/api/v1/auth/register", {
    method: "POST",
    body: formData,
  })
    .then((response) =>
      response.status >= 200 &&
      response.status <= 299 &&
      response.status !== 204
        ? response.json()
        : response
    )
    .then((data) => data)
    .catch((err) => {
      console.error("Register error:", err);
      return { message: "Server error" };
    });
};
