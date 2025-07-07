import { useEffect, useState } from "react"; 
import {
  getAllRekomendasi,
  createRekomendasi,
  updateRekomendasi,
  deleteRekomendasi,
  addToFavorit,
  removeFromFavorit,
  getAllFavorit,
} from "../../utils/api";
import { faBurger } from "@fortawesome/free-solid-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { notification, Modal, Input } from "antd";
import "./rekomendasi.css";

const getThumbnailFromLink = (url) => {
  return "";
};

const RekomendasiSosmed = () => {
  const [data, setData] = useState([]);
  const [likedItems, setLikedItems] = useState({});
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    link: "",
    kategori: "",
    thumbnail_url: "",
  });

  useEffect(() => {
    fetchRekomendasi();
  }, []);

  useEffect(() => {
    if (formVisible) {
      document.body.classList.add("disable-scroll");
    } else {
      document.body.classList.remove("disable-scroll");
    }
    return () => document.body.classList.remove("disable-scroll");
  }, [formVisible]);

  useEffect(() => {
    if (data.length > 0) {
      loadFavoritStatus();
    }
  }, [data]);

  const fetchRekomendasi = async () => {
    const result = await getAllRekomendasi();
    setData(result);
  };

  const loadFavoritStatus = async () => {
    try {
      const favoritRes = await getAllFavorit();
      const favoritData = favoritRes?.data || [];

      const newLikes = {};
      data.forEach((item, index) => {
        const isFavorited = favoritData.some(
          (fav) =>
            fav.tipe_favorit === "rekomendasi_sosmed" &&
            fav.item_id === item.id_sosmed
        );
        newLikes[index] = isFavorited;
      });
      setLikedItems(newLikes);
    } catch (err) {
      console.error("Gagal ambil data favorit:", err);
    }
  };

  const toggleLove = async (index, item) => {
    const isLiked = likedItems[index];

    const updatedLikes = { ...likedItems, [index]: !isLiked };
    setLikedItems(updatedLikes);

    try {
      if (isLiked) {
        const res = await removeFromFavorit("rekomendasi_sosmed", item.id_sosmed);
        if (res.status !== "success") {
          notification.error({ message: "Gagal menghapus dari favorit" });
        }
      } else {
        const res = await addToFavorit("rekomendasi_sosmed", item.id_sosmed);
        if (res.status !== "success") {
          notification.error({ message: "Gagal menambahkan ke favorit" });
        }
      }
    } catch (err) {
      console.error("toggleLove error:", err);
      notification.error({ message: "Terjadi kesalahan saat update favorit" });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };

    if (name === "link") {
      if (value.includes("tiktok.com")) {
        updatedData.kategori = "TikTok";
        updatedData.thumbnail_url =
          "https://i.pinimg.com/736x/22/59/e0/2259e038973dceafa59fb513cb3e0664.jpg";
      } else if (value.includes("instagram.com")) {
        updatedData.kategori = "Instagram";
        updatedData.thumbnail_url =
          "https://i.pinimg.com/736x/da/20/46/da2046dd48a3b00d16da8e8528e1595b.jpg";
      } else if (value.includes("x.com") || value.includes("twitter.com")) {
        updatedData.kategori = "X";
        updatedData.thumbnail_url =
          "https://i.pinimg.com/736x/58/f1/c2/58f1c2be2284a9dea8b69f68764bed22.jpg";
      } else {
        updatedData.kategori = "";
        updatedData.thumbnail_url = getThumbnailFromLink(value);
      }
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.judul || !formData.link || !formData.deskripsi) {
      notification.error({
        message: "Gagal",
        description: "Judul, link, dan deskripsi wajib diisi",
      });
      return;
    }

    const formBody = new FormData();
    formBody.append("judul", formData.judul);
    formBody.append("link", formData.link);
    formBody.append("deskripsi", formData.deskripsi);
    formBody.append("kategori", formData.kategori);
    if (formData.thumbnail_url) {
      formBody.append("thumbnail_url", formData.thumbnail_url);
    }

    try {
      let response;
      if (editingId) {
        response = await updateRekomendasi(editingId, formBody);
      } else {
        response = await createRekomendasi(formBody);
      }

      if (!response || response.status !== "success") {
        throw new Error(response?.message || "Terjadi kesalahan.");
      }

      notification.success({
        message: "Sukses",
        description: editingId
          ? "Rekomendasi berhasil diupdate!"
          : "Rekomendasi berhasil ditambahkan!",
      });

      setFormVisible(false);
      setEditingId(null);
      setFormData({
        judul: "",
        deskripsi: "",
        link: "",
        kategori: "",
        thumbnail_url: "",
      });
      fetchRekomendasi();
    } catch (error) {
      notification.error({
        message: "Gagal",
        description: error.message,
      });
    }
  };

  const handleEdit = (item) => {
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi,
      link: item.link,
      kategori: item.kategori || "",
      thumbnail_url: item.thumbnail_url || "",
    });
    setEditingId(item.id_sosmed);
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Konfirmasi Penghapusan",
      content: "Yakin ingin menghapus rekomendasi ini?",
      okText: "Hapus",
      okType: "danger",
      cancelText: "Batal",
      onOk: async () => {
        try {
          const response = await deleteRekomendasi(id);
          if (!response || response.status !== "success") {
            throw new Error(
              response?.message || "Terjadi kesalahan saat menghapus."
            );
          }
          notification.success({
            message: "Sukses",
            description: "Rekomendasi berhasil dihapus.",
          });
          fetchRekomendasi();
        } catch (error) {
          notification.error({ message: "Gagal", description: error.message });
        }
      },
    });
  };

  return (
    <div className="rekomendasi-bg">
      <h2 className="judul-rekomendasi">
        <span className="highlight-black">Rekomendasi</span>{" "}
        <span className="highlight-orange">Sosial Media</span>
      </h2>
      <p className="subjudul-rekomendasi">
        Jelajahi makanan unik dan tempat favorit pilihan netizen dari konten sosial media terkini
        <FontAwesomeIcon icon={faBurger} style={{ marginLeft: "8px", color: "#ff8c42" }} />
      </p>

      <div style={{ display: "flex", width: "100%", marginBottom: "30px" }}>
        <Input
          placeholder="Cari rekomendasi sosial media..."
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          style={{
            flex: 1,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderRight: "none",
            height: "50px",
            textAlign: "center",
            fontWeight: "500",
          }}
        />
        <button
          style={{
            backgroundColor: "#ff8c42",
            color: "#fff",
            border: "none",
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            padding: "0 20px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          <SearchOutlined style={{ fontSize: "20px", color: "#fff" }} />
        </button>
      </div>

      <div className="rekomendasi-grid">
        {data
          .filter((item) =>
            item.judul.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item, index) => (
            <div key={item.id_sosmed} className="card-rekomendasi">
              <div className="thumbnail-wrapper">
                <img
                  src={item.thumbnail_url || "https://via.placeholder.com/300x200?text=No+Thumbnail"}
                  className="thumbnail-img"
                  alt="Thumbnail"
                />
                <div className="thumbnail-overlay">
                  <div className="thumbnail-title-wrapper">
                    <h3 className="judul-thumbnail">{item.judul}</h3>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="thumbnail-play"
                    >
                      <FontAwesomeIcon icon={faCirclePlay} />
                    </a>
                  </div>
                </div>
                <div className="thumbnail-actions">
                  <button className="btn-edit" onClick={() => handleEdit(item)}>
                    <EditOutlined />
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(item.id_sosmed)}>
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
              <div className="info-wrapper">
                <button
                  className={`love-btn1 ${likedItems[index] ? "loved" : ""}`}
                  onClick={() => toggleLove(index, item)}
                >
                  <FontAwesomeIcon
                    icon={likedItems[index] ? solidHeart : regularHeart}
                  />
                </button>
                <p>{item.deskripsi}</p>
              </div>
            </div>
          ))}
      </div>

      <button
        className="add-button"
        onClick={() => {
          setFormVisible(true);
          setEditingId(null);
          setFormData({
            judul: "",
            deskripsi: "",
            link: "",
            kategori: "",
            thumbnail_url: "",
          });
        }}
      >
        <PlusOutlined />
      </button>

      {formVisible && (
        <div className="form-overlay-wrapper">
          <div className="form-rekomendasi-overlay">
            <div className="form-rekomendasi-container">
              <button
                className="close-rekomendasi-button"
                onClick={() => {
                  setFormVisible(false);
                  setEditingId(null);
                  setFormData({
                    judul: "",
                    deskripsi: "",
                    link: "",
                    kategori: "",
                    thumbnail_url: "",
                  });
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h2 className="form-title-sosmed">
                {editingId ? "Edit Rekomendasi" : "Tambah Rekomendasi"}
              </h2>
              <form onSubmit={handleSubmit}>
                <label>Judul</label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleFormChange}
                  required
                />
                <label>Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleFormChange}
                  rows={3}
                />
                <label>Link Sosial Media</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleFormChange}
                  required
                />
                <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "#666" }}>
                  <strong>Kategori terdeteksi:</strong> {formData.kategori || "-"}
                </p>
                <button type="submit" className="btn-submit">
                  {editingId ? "Simpan" : "Simpan"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RekomendasiSosmed;
