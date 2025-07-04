import { useEffect, useState } from "react";
import {
  getAllRekomendasi,
  createRekomendasi,
  updateRekomendasi,
  deleteRekomendasi,
} from "../../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlay,
  faTrash,
  faEdit,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { notification, Modal } from "antd";
import "./rekomendasi.css";

const getThumbnailFromLink = (url) => {
  try {
    const youtubeQueryMatch = url.match(/[?&]v=([^&#]+)/);
    const youtubeShortLinkMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    const videoId = youtubeQueryMatch?.[1] || youtubeShortLinkMatch?.[1];
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return "https://via.placeholder.com/320x180.png?text=Thumbnail";
  } catch {
    return "https://via.placeholder.com/320x180.png?text=Thumbnail";
  }
};

const RekomendasiSosmed = () => {
  const [data, setData] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    link: "",
    thumbnail_url: "",
  });

  useEffect(() => {
    fetchRekomendasi();
  }, []);

  const fetchRekomendasi = async () => {
    const result = await getAllRekomendasi();
    setData(result);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };

    if (name === "link") {
      updatedData.thumbnail_url = getThumbnailFromLink(value);
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
    formBody.append("thumbnail_url", formData.thumbnail_url);

    let response;
    if (editingId) {
      response = await updateRekomendasi(editingId, formBody);
    } else {
      response = await createRekomendasi(formBody);
    }

    if (response.status === "success") {
      notification.success({
        message: "Sukses",
        description: editingId
          ? "Rekomendasi berhasil diupdate!"
          : "Rekomendasi berhasil ditambahkan!",
      });
      setFormVisible(false);
      setEditingId(null);
      setFormData({ judul: "", deskripsi: "", link: "", thumbnail_url: "" });
      fetchRekomendasi();
    } else {
      notification.error({
        message: "Gagal",
        description: response.message || "Terjadi kesalahan.",
      });
    }
  };

  const handleEdit = (item) => {
    setFormData({
      judul: item.judul,
      deskripsi: item.deskripsi,
      link: item.link,
      thumbnail_url: item.thumbnail_url,
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
        const response = await deleteRekomendasi(id);
        if (response.status === "success") {
          notification.success({
            message: "Sukses",
            description: "Rekomendasi berhasil dihapus.",
          });
          fetchRekomendasi();
        } else {
          notification.error({
            message: "Gagal",
            description: response.message || "Terjadi kesalahan.",
          });
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

      <div className="rekomendasi-grid">
        {data.map((item) => (
          <div key={item.id_sosmed} className="card-rekomendasi">
            <div className="thumbnail-wrapper">
              <img
                src={item.thumbnail_url}
                alt={item.judul}
                className="thumbnail-img"
              />

              <div className="thumbnail-overlay">
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

              <div className="thumbnail-actions">
                <button className="btn-edit" onClick={() => handleEdit(item)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(item.id_sosmed)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>

            <div className="info-wrapper">
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
            thumbnail_url: "",
          });
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
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
                    thumbnail_url: "",
                  });
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h2 className="form-title">
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

                <label>Link Video</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleFormChange}
                  required
                />

                <label>Link Thumbnail</label>
                <input
                  type="text"
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleFormChange}
                  readOnly
                />

                <button type="submit" className="btn-submit">
                  {editingId ? "Update Rekomendasi" : "Simpan Rekomendasi"}
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
