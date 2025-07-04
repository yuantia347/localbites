import { useEffect, useState } from "react";
import {
  getAllRekomendasi,
  createRekomendasi,
  updateRekomendasi,
  deleteRekomendasi,
} from "../../utils/api";
import { notification } from "antd";
import "./rekomendasi.css";

const RekomendasiSosmed = () => {
  const [rekomendasiList, setRekomendasiList] = useState([]);
  const [formData, setFormData] = useState({
    judul: "",
    link: "",
    deskripsi: "",
    thumbnail_url: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchRekomendasi();
  }, []);

  const fetchRekomendasi = async () => {
    const data = await getAllRekomendasi();
    setRekomendasiList(data);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.judul || !formData.link || !formData.deskripsi || !formData.thumbnail_url) {
      return notification.error({ message: "Semua field wajib diisi!" });
    }

    try {
      if (editId) {
        await updateRekomendasi(editId, formData);
        notification.success({ message: "Rekomendasi berhasil diupdate." });
      } else {
        await createRekomendasi(formData);
        notification.success({ message: "Rekomendasi berhasil ditambahkan." });
      }
      setFormData({ judul: "", link: "", deskripsi: "", thumbnail_url: "" });
      setEditId(null);
      fetchRekomendasi();
    } catch {
      notification.error({ message: "Gagal menyimpan data." });
    }
  };

  const handleEdit = (item) => {
    setFormData({
      judul: item.judul,
      link: item.link,
      deskripsi: item.deskripsi,
      thumbnail_url: item.thumbnail_url,
    });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await deleteRekomendasi(id);
      notification.success({ message: "Berhasil dihapus." });
      fetchRekomendasi();
    } catch {
      notification.error({ message: "Gagal menghapus data." });
    }
  };

  return (
    <div className="rekomendasi-container">
      <h2>Rekomendasi Sosmed</h2>

      <form onSubmit={handleSubmit} className="form-rekomendasi">
        <input type="text" name="judul" placeholder="Judul" value={formData.judul} onChange={handleChange} />
        <input type="text" name="link" placeholder="Link" value={formData.link} onChange={handleChange} />
        <input type="text" name="thumbnail_url" placeholder="Thumbnail URL" value={formData.thumbnail_url} onChange={handleChange} />
        <textarea name="deskripsi" placeholder="Deskripsi" value={formData.deskripsi} onChange={handleChange}></textarea>
        <button type="submit">{editId ? "Update" : "Tambah"}</button>
      </form>

      <div className="rekomendasi-list">
        {rekomendasiList.length === 0 && <p>Belum ada data rekomendasi.</p>}
        {rekomendasiList.map((item) => (
          <div key={item.id} className="rekomendasi-card">
            <h3>{item.judul}</h3>
            <img src={item.thumbnail_url} alt="thumbnail" style={{ maxWidth: "100%", maxHeight: "200px" }} />
            <p>{item.deskripsi}</p>
            <a href={item.link} target="_blank" rel="noreferrer">{item.link}</a>
            <div className="card-buttons">
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item.id)}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RekomendasiSosmed;
