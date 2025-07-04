import React, { useEffect, useState } from 'react';
import './resep_masakan.css';
import { getAllResep, createResep, updateResepPrivate, deleteResepPrivate } from '../../utils/api';
import { notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart, faUtensils, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const categories = ['Semua Resep', 'Pembuka', 'Menu Utama', 'Pencuci Mulut', 'Minuman'];

function ResepMasakan() {
  const [resepList, setResepList] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua Resep');
  const [likedItems, setLikedItems] = useState({});
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    bahan: '',
    langkah: '',
    kategori: '',
    foto: '',
  });

  useEffect(() => {
    loadData();
    const tokenData = JSON.parse(localStorage.getItem('userData'));
    if (tokenData && tokenData.id_user) {
      setCurrentUserId(tokenData.id_user);
    }
  }, []);

  const loadData = async () => {
    try {
      const res = await getAllResep();
      setResepList(Array.isArray(res) ? res : res?.data || []);
    } catch (err) {
      console.error('Gagal ambil data resep:', err);
      setResepList([]);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const toggleLove = (index) => {
    setLikedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.judul || !formData.bahan || !formData.langkah) {
      notification.error({
        message: 'Input tidak lengkap',
        description: 'Judul, bahan, dan langkah wajib diisi.',
      });
      return;
    }

    let response;
    if (editingId) {
      response = await updateResepPrivate(editingId, formData);
    } else {
      response = await createResep(formData);
    }

    if (response.status === 'success') {
      notification.success({
        message: 'Sukses',
        description: editingId ? 'Resep berhasil diupdate!' : 'Resep berhasil ditambahkan!',
      });
      setFormData({ judul: '', bahan: '', langkah: '', kategori: '', foto: '' });
      setEditingId(null);
      setFormVisible(false);
      loadData();
    } else {
      notification.error({
        message: 'Gagal',
        description: response.message || 'Terjadi kesalahan.',
      });
    }
  };

  const handleEdit = (resep) => {
    setFormData({ ...resep });
    setEditingId(resep.id);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus resep ini?');
    if (!confirmDelete) return;

    const response = await deleteResepPrivate(id);
    if (response.status === 'success') {
      notification.success({
        message: 'Sukses',
        description: 'Resep berhasil dihapus.',
      });
      loadData();
    } else {
      notification.error({
        message: 'Gagal',
        description: response.message || 'Terjadi kesalahan.',
      });
    }
  };

  const filteredResep =
    selectedCategory === 'Semua Resep'
      ? resepList
      : resepList.filter((r) =>
          r.kategori?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  return (
    <div className="resep-page-wrapper">
      <div className="resep-masakan-container">
        <h2>Buat apa <span className="highlight">hari ini</span>?</h2>

        {/* Filter Kategori */}
        <div className="kategori-filter">
          {categories.map((item, index) => (
            <span
              key={index}
              className={`kategori-item ${selectedCategory === item ? 'active' : ''}`}
              onClick={() => setSelectedCategory(item)}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Daftar Resep */}
        <div className="resep-grid">
          {filteredResep.map((resep, index) => (
            <div key={resep.id || index} className="resep-card">
              <div className="resep-detail">
                <h3 className="resep-title">{resep.judul}</h3>
              </div>

              <div className="resep-img-container">
                <img
                  src={resep.foto || 'https://source.unsplash.com/300x200/?food'}
                  alt={resep.judul}
                  className="resep-img"
                />
                <button
                  className={`love-btn ${likedItems[index] ? 'loved' : ''}`}
                  onClick={() => toggleLove(index)}
                >
                  <FontAwesomeIcon icon={likedItems[index] ? solidHeart : regularHeart} />
                </button>
              </div>

              <div className="resep-detail">
                <p><strong>Kategori:</strong> {resep.kategori?.trim() || '-'}</p>
                <p><strong>By:</strong> {resep.username?.trim() || 'Anonymous'}</p>

                <button className="btn-lihat" onClick={() => toggleExpand(index)}>
                  <span>{expandedIndex === index ? 'Sembunyikan' : 'Detail Resep'}</span>
                  <FontAwesomeIcon icon={expandedIndex === index ? faEyeSlash : faUtensils} />
                </button>

                {expandedIndex === index && (
                  <div className="resep-extra">
                    <p><strong>Bahan:</strong></p>
                    {resep.bahan ? (
                      <ul>
                        {resep.bahan.split('\n').map((b, i) => (
                          <li key={i}>{b.trim()}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>-</p>
                    )}

                    <p><strong>Langkah:</strong></p>
                    {resep.langkah ? (
                      <ol>
                        {resep.langkah.split('\n').map((l, i) => (
                          <li key={i}>{l.trim()}</li>
                        ))}
                      </ol>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                )}
               <div className="resep-actions">
                  <button className="btn-edit" onClick={() => handleEdit(resep)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(resep.id)}>Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Tambah */}
        <button className="add-button" onClick={() => {
          setFormVisible(true);
          setEditingId(null);
          setFormData({ judul: '', bahan: '', langkah: '', kategori: '', foto: '' });
        }}>+</button>

        {/* Form Tambah/Edit */}
        {formVisible && (
          <div className="form-overlay-wrapper">
            <div className="form-resep-overlay">
              <div className="form-resep-container">
                <button className="close-resep-button" onClick={() => {
                  setFormVisible(false);
                  setEditingId(null);
                  setFormData({ judul: '', bahan: '', langkah: '', kategori: '', foto: '' });
                }}>×</button>
                <h2 className="form-title">{editingId ? 'Edit Resep' : 'Tambah Resep'}</h2>
                <form onSubmit={handleSubmit}>
                  <label>Judul Resep</label>
                  <input type="text" name="judul" value={formData.judul} onChange={handleFormChange} required />

                  <label>Bahan</label>
                  <textarea name="bahan" value={formData.bahan} onChange={handleFormChange} rows={4} required />

                  <label>Langkah</label>
                  <textarea name="langkah" value={formData.langkah} onChange={handleFormChange} rows={4} required />

                  <label>Kategori</label>
                  <select name="kategori" value={formData.kategori} onChange={handleFormChange}>
                    <option value="">Pilih Kategori</option>
                    <option value="Pembuka">Pembuka</option>
                    <option value="Menu Utama">Menu Utama</option>
                    <option value="Pencuci Mulut">Pencuci Mulut</option>
                    <option value="Minuman">Minuman</option>
                  </select>

                  <label>Link Gambar</label>
                  <input type="text" name="foto" value={formData.foto} onChange={handleFormChange} />

                  <button type="submit" className="btn-submit">
                    {editingId ? 'Update Resep' : 'Simpan Resep'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResepMasakan;
