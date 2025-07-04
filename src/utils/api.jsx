import { jwtStorage } from "./jwt_storage";

const REACT_APP_API_URL = import.meta.env.VITE_REACT_APP_API_URL;

// ✅ Kirim data publik (POST, tanpa token)
export const sendData = async (url, data) => {
  try {
    const res = await fetch(REACT_APP_API_URL + url, {
      method: "POST",
      body: data,
    });
    return res.status >= 200 && res.status < 300 && res.status !== 204
      ? res.json()
      : res;
  } catch (err) {
    console.error("SendData error:", err);
    throw err;
  }
};

// ✅ Ambil data privat (GET, pakai token)
export const getDataPrivate = async (url) => {
  try {
    const token = await jwtStorage.retrieveToken();
    const res = await fetch(REACT_APP_API_URL + url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status >= 200 && res.status < 300 && res.status !== 204
      ? res.json()
      : res;
  } catch (err) {
    console.error("getDataPrivate error:", err);
    throw err;
  }
};

// ✅ Kirim data privat (POST dengan token)
export const sendDataPrivate = async (url, data) => {
  try {
    const token = await jwtStorage.retrieveToken();
    const res = await fetch(REACT_APP_API_URL + url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    if (res.status === 401) return { isExpiredJWT: true };
    return res.status >= 200 && res.status < 300 && res.status !== 204
      ? res.json()
      : res;
  } catch (err) {
    console.error("sendDataPrivate error:", err);
    throw err;
  }
};

// ✅ Edit data privat (PUT JSON)
export const editDataPrivatePut = async (url, data) => {
  try {
    const token = await jwtStorage.retrieveToken();
    const res = await fetch(REACT_APP_API_URL + url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.status === 401) return { isExpiredJWT: true };
    return res.status >= 200 && res.status < 300 && res.status !== 204
      ? res.json()
      : res;
  } catch (err) {
    console.error("editDataPrivatePut error:", err);
    throw err;
  }
};

// ✅ Hapus data privat (DELETE dengan JSON body)
export const deleteDataPrivateJSON = async (url, data) => {
  try {
    const token = await jwtStorage.retrieveToken();
    const res = await fetch(REACT_APP_API_URL + url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (res.status === 401) return { isExpiredJWT: true };
    return res.status >= 200 && res.status < 300 && res.status !== 204
      ? res.json()
      : res;
  } catch (err) {
    console.error("deleteDataPrivateJSON error:", err);
    throw err;
  }
};

// ✅ Logout & hapus token JWT
export const logoutAPI = async () => {
  try {
    const token = await jwtStorage.retrieveToken();
    const formData = new FormData();
    formData.append("logout", "Logout");

    const res = await fetch(REACT_APP_API_URL + "/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.status === 200) {
      await jwtStorage.removeItem();
      return { isLoggedOut: true };
    } else {
      console.error("Logout failed:", res.statusText);
      return { isLoggedOut: false };
    }
  } catch (err) {
    console.error("Logout error:", err);
    return { isLoggedOut: false };
  }
};

// ✅ Ambil gambar profil user
export const getImage = (url_image) => {
  const imgDefault = "/storage/images/userpng_1717846018.png";
  const imgResult = url_image || imgDefault;
  return REACT_APP_API_URL + imgResult;
};

// ✅ Registrasi user
export const registerUser = async (formData) => {
  try {
    const res = await fetch(REACT_APP_API_URL + "/api/v1/auth/register", {
      method: "POST",
      body: formData,
    });

    return res.status >= 200 && res.status < 300 && res.status !== 204
      ? res.json()
      : res;
  } catch (err) {
    console.error("Register error:", err);
    return { message: "Server error" };
  }
};

////////////////////////////////////////
// FITUR RESEP MASAKAN (CRUD)

// ✅ Ambil semua resep (public atau ubah jadi privat jika perlu)
export const getAllResep = async () => {
  try {
    const token = await jwtStorage.retrieveToken();
    const res = await fetch(REACT_APP_API_URL + "/api/v1/resep/read", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Gagal ambil resep");

    const result = await res.json();
    return result.data || []; // ✅ hanya kembalikan array
  } catch (err) {
    console.error("Error fetching resep:", err);
    return [];
  }
};
;

// ✅ Buat resep baru (private)
export const createResep = async (data) => {
  try {
    const token = await jwtStorage.retrieveToken();
    const res = await fetch(REACT_APP_API_URL + "/api/v1/resep/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("Create error:", err);
    return { status: "error", message: err.message };
  }
};

// ✅ Update resep (private)
export const updateResepPrivate = async (id, data) => {
  try {
    const token = await jwtStorage.retrieveToken();
    const res = await fetch(REACT_APP_API_URL + `/api/v1/resep/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("Error update resep:", err);
    return { status: "error", message: err.message };
  }
};

// ✅ Hapus resep (private)
export const deleteResepPrivate = async (id) => {
  try {
    const token = await jwtStorage.retrieveToken();
    const res = await fetch(`${REACT_APP_API_URL}/api/v1/resep/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = res.headers.get("Content-Type");
    return contentType && contentType.includes("application/json")
      ? res.json()
      : { status: "error", message: "Server tidak mengembalikan JSON." };
  } catch (err) {
    return { status: "error", message: "Gagal menghapus data" };
  }
};

/**
 * Ambil semua data rekomendasi sosmed (public)
 */
export const getAllRekomendasi = async () => {
  try {
    const res = await fetch(REACT_APP_API_URL + "/api/v1/sosmed/read");
    if (!res.ok) throw new Error("Gagal ambil rekomendasi");
    const result = await res.json();
    return result.data || [];
  } catch (err) {
    console.error("Error fetching rekomendasi:", err);
    return [];
  }
};

/**
 * Tambah rekomendasi sosmed (private, pakai FormData)
 */
export const createRekomendasi = async (formData) => {
  try {
    const token = await jwtStorage.retrieveToken();
    const res = await fetch(REACT_APP_API_URL + "/api/v1/sosmed/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❗ Jangan set Content-Type di sini, biarkan browser mengatur multipart/form-data
      },
      body: formData,
    });

    return await res.json();
  } catch (err) {
    console.error("Create rekomendasi error:", err);
    return { status: "error", message: err.message };
  }
};

/**
 * Update rekomendasi sosmed (private, pakai FormData)
 */
export const updateRekomendasi = async (id, formData) => {
  try {
    const token = await jwtStorage.retrieveToken();
    const res = await fetch(`${REACT_APP_API_URL}/api/v1/sosmed/update/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❗ Jangan pakai Content-Type manual di sini juga
      },
      body: formData,
    });

    return await res.json();
  } catch (err) {
    console.error("Update rekomendasi error:", err);
    return { status: "error", message: err.message };
  }
};

/**
 * Hapus rekomendasi sosmed (private)
 */
export const deleteRekomendasi = async (id) => {
  try {
    const token = await jwtStorage.retrieveToken();
    const res = await fetch(`${REACT_APP_API_URL}/api/v1/sosmed/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = res.headers.get("Content-Type");
    return contentType && contentType.includes("application/json")
      ? res.json()
      : { status: "error", message: "Server tidak mengembalikan JSON." };
  } catch (err) {
    console.error("Delete rekomendasi error:", err);
    return { status: "error", message: "Gagal menghapus data" };
  }
};



