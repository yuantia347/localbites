import React, { useEffect, useState } from 'react';
import './usaha_kuliner.css';
import {
  getDataPrivate,
  sendDataPrivate,
  editDataPrivatePut,
  deleteDataPrivateJSON
} from '../../utils/api';
import { notification } from 'antd';

function UsahaKuliner() {
  const [usahaList, setUsahaList] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama_usaha: '',
    deskripsi: '',
    lokasi: '',
    kontak: '',
    foto: '',
    jam_buka: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getDataPrivate('/api/v1/usaha/read');
      setUsahaList(res.data || []);
    } catch (err) {
      console.error('Gagal ambil data usaha:', err);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    let response;
    if (editingId) {
      response = await editDataPrivatePut(`/api/v1/usaha/update/${editingId}`, formData);
    } else {
      response = await sendDataPrivate('/api/v1/usaha/create', data);
    }

    if (response.status === 'success') {
      notification.success({
        message: 'Sukses',
        description: editingId ? 'Usaha berhasil diupdate!' : 'Usaha berhasil ditambahkan!'
      });
      resetForm();
      loadData();
    } else {
      notification.error({
        message: 'Gagal',
        description: response.message || 'Terjadi kesalahan.'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nama_usaha: '',
      deskripsi: '',
      lokasi: '',
      kontak: '',
      foto: '',
      jam_buka: ''
    });
    setEditingId(null);
    setFormVisible(false);
  };

  const handleEdit = (usaha) => {
    setFormData(usaha);
    setEditingId(usaha.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus usaha ini?');
    if (!confirmDelete) return;

    const response = await deleteDataPrivateJSON(`/api/v1/usaha/delete/${id}`);
    if (response.status === 'success') {
      notification.success({
        message: 'Sukses',
        description: 'Usaha berhasil dihapus.'
      });
      loadData();
    } else {
      notification.error({
        message: 'Gagal',
        description: response.message || 'Terjadi kesalahan.'
      });
    }
  };

  return (
    <div className="resep-masakan-container">
      <h2>Usaha Kuliner</h2>

      <div className="resep-grid">
        {usahaList.map((usaha) => (
          <div key={usaha.id} className="resep-card">
            <img
              className="resep-img"
              src={usaha.foto || 'https://source.unsplash.com/300x200/?restaurant'}
              alt={usaha.nama_usaha}
            />
            <h3 className="resep-title">{usaha.nama_usaha}</h3>
            <div className="resep-detail">
              <p><strong>Lokasi:</strong> {usaha.lokasi}</p>
              <p><strong>Kontak:</strong> {usaha.kontak}</p>
              <p><strong>Jam Buka:</strong> {usaha.jam_buka}</p>
              <p><strong>Deskripsi:</strong> {usaha.deskripsi}</p>
            </div>
            <div className="resep-actions">
              <button onClick={() => handleEdit(usaha)} className="btn-edit">Edit</button>
              <button onClick={() => handleDelete(usaha.id)} className="btn-delete">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      <button className="add-button" onClick={() => {
        setFormVisible(true);
        setEditingId(null);
        setFormData({
          nama_usaha: '',
          deskripsi: '',
          lokasi: '',
          kontak: '',
          foto: '',
          jam_buka: '',
        });
      }}>+</button>

      {formVisible && (
        <div className="form-overlay-wrapper">
          <div className="form-resep-overlay">
            <div className="form-resep-container">
              <button className="close-resep-button" onClick={resetForm}>×</button>
              <h2 className="form-title">{editingId ? 'Edit Usaha' : 'Tambah Usaha'}</h2>
              <form onSubmit={handleSubmit}>
                <label>Nama Usaha</label>
                <input
                  type="text"
                  name="nama_usaha"
                  value={formData.nama_usaha}
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

                <label>Lokasi</label>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleFormChange}
                />

                <label>Kontak</label>
                <input
                  type="text"
                  name="kontak"
                  value={formData.kontak}
                  onChange={handleFormChange}
                />

                <label>Jam Buka</label>
                <input
                  type="text"
                  name="jam_buka"
                  value={formData.jam_buka}
                  onChange={handleFormChange}
                />

                <label>Foto (URL)</label>
                <input
                  type="text"
                  name="foto"
                  value={formData.foto}
                  onChange={handleFormChange}
                />

                <button type="submit" className="btn-submit">
                  {editingId ? 'Update Usaha' : 'Simpan Usaha'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsahaKuliner;