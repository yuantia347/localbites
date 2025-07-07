import React, { useEffect, useState } from 'react';
import '../ResepMasakan/resep_masakan.css';
import {
  getAllResep,
  getAllRekomendasi,
  getAllFavorit,
  removeFromFavorit,
  getDataPrivate,
} from '../../utils/api';
import { notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as solidHeart,
  faUtensils,
  faEyeSlash,
  faCirclePlay
} from '@fortawesome/free-solid-svg-icons';
import { EnvironmentOutlined, ClockCircleOutlined, PhoneOutlined } from '@ant-design/icons';

function FavoritSaya() {
  const [resepList, setResepList] = useState([]);
  const [sosmedList, setSosmedList] = useState([]);
  const [usahaList, setUsahaList] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [kategori, setKategori] = useState('Semua');

  useEffect(() => {
    loadFavoritData();
  }, []);

  const loadFavoritData = async () => {
    try {
      const [resepRes, sosmedRes, favoritRes, usahaRes] = await Promise.all([
        getAllResep(),
        getAllRekomendasi(),
        getAllFavorit(),
        getDataPrivate('/api/v1/usaha/read')
      ]);

      const resepData = Array.isArray(resepRes) ? resepRes : resepRes?.data || [];
      const sosmedData = Array.isArray(sosmedRes) ? sosmedRes : sosmedRes?.data || [];
      const usahaData = usahaRes?.data || [];
      const favoritData = favoritRes?.data || [];

      const resepFavorit = resepData.filter((r) =>
        favoritData.some(
          (fav) => fav.tipe_favorit === 'resep_masakan' && fav.item_id === r.id
        )
      );

      const sosmedFavorit = sosmedData.filter((s) =>
        favoritData.some(
          (fav) => fav.tipe_favorit === 'rekomendasi_sosmed' && fav.item_id === s.id_sosmed
        )
      );

      const usahaFavorit = usahaData.filter((u) =>
        favoritData.some(
          (fav) => fav.tipe_favorit === 'usaha_kuliner' && fav.item_id === u.id_usaha
        )
      );

      setResepList(resepFavorit);
      setSosmedList(sosmedFavorit);
      setUsahaList(usahaFavorit);
    } catch (err) {
      console.error('Gagal load data favorit:', err);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const hapusFavorit = async (tipe, id) => {
    try {
      const res = await removeFromFavorit(tipe, id);
      if (res.status === 'success') {
        notification.success({ message: 'Berhasil dihapus dari favorit' });
        loadFavoritData();
      } else {
        notification.error({ message: 'Gagal menghapus favorit' });
      }
    } catch (err) {
      console.error('Error hapus favorit:', err);
      notification.error({ message: 'Terjadi kesalahan saat menghapus' });
    }
  };

  const renderKategori = () => (
    <div className="kategori-filter">
      {['Semua', 'Usaha Kuliner', 'Rekomendasi Sosial Media', 'Resep Masakan'].map((item) => (
        <span
          key={item}
          className={`kategori-item ${kategori === item ? 'active' : ''}`}
          onClick={() => setKategori(item)}
        >
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="resep-page-wrapper">
      <div className="resep-masakan-container">
        <h2>Konten <span className="highlight">Favorit Saya</span></h2>

        {/* Kategori Tabs */}
        {renderKategori()}

        {/* USAHA KULINER */}
        {(kategori === 'Semua' || kategori === 'Usaha Kuliner') && usahaList.length > 0 && (
          <>
            <h3 style={{ marginTop: '30px' }}>Usaha Kuliner</h3>
            <div className="kuliner-list">
              {usahaList.map((usaha) => (
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
                          className="love-btn2 loved"
                          onClick={() => hapusFavorit('usaha_kuliner', usaha.id_usaha)}
                        >
                          <FontAwesomeIcon icon={solidHeart} />
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
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* REKOMENDASI SOSIAL MEDIA */}
        {(kategori === 'Semua' || kategori === 'Rekomendasi Sosial Media') && sosmedList.length > 0 && (
            <>
              <h3 style={{ marginTop: '30px' }}>Rekomendasi Sosial Media</h3>
              <div className="rekomendasi-grid">
                {sosmedList.map((item) => (
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
                    </div>

                    <div className="info-wrapper">
                      <div className="favorite-wrapper">
                        <button
                          className="love-btn2 loved"
                          onClick={() => hapusFavorit('rekomendasi_sosmed', item.id_sosmed)}
                        >
                          <FontAwesomeIcon icon={solidHeart} />
                        </button>
                      </div>
                      <p>{item.deskripsi}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}


        {/* RESEP MASAKAN */}
        {(kategori === 'Semua' || kategori === 'Resep Masakan') && resepList.length > 0 && (
          <>
            <h3 style={{ marginTop: '30px' }}>Resep Masakan</h3>
            <div className="resep-grid">
              {resepList.map((resep, index) => (
                <div key={resep.id} className="resep-card">
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
                      className="love-btn loved"
                      onClick={() => hapusFavorit('resep_masakan', resep.id)}
                    >
                      <FontAwesomeIcon icon={solidHeart} />
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
                          <ul>{resep.bahan.split('\n').map((b, i) => <li key={i}>{b.trim()}</li>)}</ul>
                        ) : <p>-</p>}

                        <p><strong>Langkah:</strong></p>
                        {resep.langkah ? (
                          <ol>{resep.langkah.split('\n').map((l, i) => <li key={i}>{l.trim()}</li>)}</ol>
                        ) : <p>-</p>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TIDAK ADA FAVORIT */}
        {resepList.length === 0 && sosmedList.length === 0 && usahaList.length === 0 && (
          <p style={{ marginTop: '20px', textAlign: 'center' }}>Belum ada item favorit.</p>
        )}
      </div>
    </div>
  );
}

export default FavoritSaya;
