import React, { useEffect, useState } from 'react';
import './usaha_kuliner.css';
import {
  getDataPrivate,
  sendDataPrivate,
  editDataPrivatePut,
  deleteDataPrivateJSON,
  addToFavorit,
  removeFromFavorit,
  getAllFavorit,
} from '../../utils/api';
import { Modal, notification, Input } from 'antd';
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  PlusOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

function UsahaKuliner() {
  const [usahaList, setUsahaList] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [likedItems, setLikedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nama_usaha: '',
    menu: '',
    lokasi: '',
    kontak: '',
    foto: '',
    jam_buka: '',
  });

  const [modalMenu, setModalMenu] = useState({ visible: false, content: '' });
  const [modalDelete, setModalDelete] = useState({ visible: false, id: null });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formVisible) {
      document.body.classList.add('disable-scroll');
    } else {
      document.body.classList.remove('disable-scroll');
    }

    return () => document.body.classList.remove('disable-scroll');
  }, [formVisible]);

  useEffect(() => {
    const loadFavorit = async () => {
      try {
        const res = await getAllFavorit();
        const favoritData = res?.data || [];
        const newLikes = {};
        usahaList.forEach((usaha, index) => {
          const isFavorited = favoritData.some(
            (fav) =>
              fav.tipe_favorit === 'usaha_kuliner' &&
              fav.item_id === usaha.id_usaha
          );
          newLikes[index] = isFavorited;
        });
        setLikedItems(newLikes);
      } catch (err) {
        console.error('Gagal ambil favorit:', err);
      }
    };
    if (usahaList.length > 0) loadFavorit();
  }, [usahaList]);

  const loadData = async () => {
    try {
      const res = await getDataPrivate('/api/v1/usaha/read');
      setUsahaList(res.data || []);
    } catch (err) {
      console.error('Gagal ambil data usaha:', err);
    }
  };

  const toggleLove = async (index, usaha) => {
    const isLiked = likedItems[index];
    setLikedItems((prev) => ({ ...prev, [index]: !isLiked }));

    try {
      if (isLiked) {
        const res = await removeFromFavorit("usaha_kuliner", usaha.id_usaha);
        if (res.status !== "success") {
          notification.error({ message: "Gagal menghapus dari favorit" });
        }
      } else {
        const res = await addToFavorit("usaha_kuliner", usaha.id_usaha);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let response;
    if (editingId) {
      response = await editDataPrivatePut(`/api/v1/usaha/update/${editingId}`, formData);
    } else {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
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
      menu: '',
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
    setEditingId(usaha.id_usaha);
    setFormVisible(true);
  };

  const confirmDelete = async () => {
    const id_usaha = modalDelete.id;
    if (!id_usaha) return;
    const response = await deleteDataPrivateJSON(`/api/v1/usaha/delete/${id_usaha}`);
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
    setModalDelete({ visible: false, id: null });
  };

  const usahaFiltered = usahaList.filter((usaha) =>
    usaha.nama_usaha.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="kuliner-container">
      <h2>Usaha <span className="highlight">Kuliner</span></h2>
      <p className="subjudul-kuliner">Jelajahi usaha kuliner terbaik dan bantu promosikan favorit Anda!</p>
      <div style={{ display: "flex", width: "100%", marginBottom: "30px" }}>
        <Input
          placeholder="Cari nama usaha kuliner..."
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

      <div className="kuliner-list">
        {usahaFiltered.map((usaha, index) => (
          <div key={usaha.id_usaha} className="kuliner-card">
            <img
              className="kuliner-img"
              src={usaha.foto || 'https://source.unsplash.com/300x200/?restaurant'}
              alt={usaha.nama_usaha}
            />
            <div className="kuliner-info">
              <div className="kuliner-left">
                <h3 className="kuliner-title">{usaha.nama_usaha}</h3>
                <div className="favorite-wrapper">
                  <button
                    className={`love-btn2 ${likedItems[index] ? "loved" : ""}`}
                    onClick={() => toggleLove(index, usaha)}
                  >
                    <FontAwesomeIcon icon={likedItems[index] ? solidHeart : regularHeart} />
                  </button>
                  <span className="favorite-text">Favorit</span>
                </div>
              </div>
              <div className="kuliner-middle">
                <p className="kuliner-lokasi">
                  <EnvironmentOutlined />{' '}
                  <a href={usaha.lokasi} target="_blank" rel="noopener noreferrer">
                    Lihat Lokasi
                  </a>
                </p>
                <p className="kuliner-jam">
                  <ClockCircleOutlined /> {usaha.jam_buka}
                </p>
                <p className="kuliner-kontak">
                  <PhoneOutlined /> {usaha.kontak}
                </p>
              </div>
              <div className="kuliner-actions">
                <button className="btn-view view-menu" onClick={() => setModalMenu({ visible: true, content: usaha.menu })}>View Menu</button>
                <button className="btn-view edit" onClick={() => handleEdit(usaha)}><EditOutlined /></button>
                <button className="btn-view delete" onClick={() => setModalDelete({ visible: true, id: usaha.id_usaha })}><DeleteOutlined /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="add-button" onClick={() => {
        setFormVisible(true);
        setEditingId(null);
        setFormData({
          nama_usaha: '',
          menu: '',
          lokasi: '',
          kontak: '',
          foto: '',
          jam_buka: '',
        });
      }}><PlusOutlined /></button>

      {formVisible && (
        <div className="form-overlay-wrapper" onClick={() => setFormVisible(false)}>
          <div className="form-resep-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="form-usaha-container">
              <button className="close-button" onClick={() => setFormVisible(false)}><CloseOutlined /></button>
              <h3>{editingId ? 'Edit Usaha Kuliner' : 'Tambah Usaha Kuliner'}</h3>
              <form onSubmit={handleSubmit}>

                <label htmlFor="nama_usaha">Nama Usaha</label>
                <input type="text" name="nama_usaha" id="nama_usaha" value={formData.nama_usaha} onChange={handleFormChange} required />

                <label htmlFor="menu">Menu</label>
                <textarea name="menu" id="menu" value={formData.menu} onChange={handleFormChange} required rows={4}></textarea>

                <label htmlFor="lokasi">Link Lokasi</label>
                <input type="text" name="lokasi" id="lokasi" value={formData.lokasi} onChange={handleFormChange} required />

                <label htmlFor="kontak">Kontak</label>
                <input type="text" name="kontak" id="kontak" value={formData.kontak} onChange={handleFormChange} required />

                <label htmlFor="foto">URL Foto</label>
                <input type="text" name="foto" id="foto" value={formData.foto} onChange={handleFormChange} required />

                <label htmlFor="jam_buka">Jam Buka</label>
                <input type="text" name="jam_buka" id="jam_buka" value={formData.jam_buka} onChange={handleFormChange} required />

                <button type="submit" className="btn-view edit">{editingId ? 'Simpan' : 'Simpan'}</button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Modal
        title="Daftar Menu"
        open={modalMenu.visible}
        onOk={() => setModalMenu({ ...modalMenu, visible: false })}
        onCancel={() => setModalMenu({ ...modalMenu, visible: false })}
        okText="Tutup"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <pre>{modalMenu.content}</pre>
      </Modal>

      <Modal
        title="Konfirmasi Hapus"
        open={modalDelete.visible}
        onOk={confirmDelete}
        onCancel={() => setModalDelete({ visible: false, id: null })}
        okText="Hapus"
        okButtonProps={{ danger: true }}
        cancelText="Batal"
      >
        <p>Apakah Anda yakin ingin menghapus usaha ini?</p>
      </Modal>
    </div>
  );
}

export default UsahaKuliner;
