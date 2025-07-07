import { useState, useEffect, useContext } from "react";
import { Menu, Modal } from "antd"; // ✅ gunakan Modal, bukan Popconfirm
import { useNavigate, useLocation } from "react-router-dom";
import {
  FileImageOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  BookOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../providers/AuthProvider";
import "./sidenav.css";

function Sidenav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const [selectedKey, setSelectedKey] = useState(location.pathname);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const handleMenuClick = (key) => {
    setSelectedKey(key);
    navigate(key);
  };

  const handleLogoutClick = () => {
    Modal.confirm({
      title: "Konfirmasi Logout",
      content: "Apakah Anda yakin ingin keluar dari aplikasi?",
      okText: "Ya, Keluar",
      okType: "danger",
      cancelText: "Batal",
      onOk: logout,
    });
  };

  const menuItems = [
    { key: "/beranda", icon: HomeOutlined, label: "Beranda" },
    { key: "/usahakuliner", icon: ShoppingCartOutlined, label: "Usaha Kuliner" },
    { key: "/rekomendasisosmed", icon: FileImageOutlined, label: "Rekomendasi" },
    { key: "/resepmasakan", icon: BookOutlined, label: "Resep Masakan" },
    { key: "/favoritsaya", icon: UnorderedListOutlined, label: "Favorit Saya" },
    {
      key: "logout", // bukan /logout, biar tidak bentrok dengan route
      icon: LogoutOutlined,
      label: "Keluar",
      isLogout: true,
    },
  ];

  const renderMenuItems = menuItems.map((item) => {
    const isSelected = selectedKey === item.key;
    const IconComponent = item.icon;

    return {
      key: item.key,
      label: (
        <div
          onClick={() => {
            if (item.isLogout) {
              handleLogoutClick();
            } else {
              handleMenuClick(item.key);
            }
          }}
          className={`menu-item-wrapper ${isSelected ? "active" : ""} ${
            item.isLogout ? "logout" : ""
          }`}
        >
          <div className="icon-wrapper">
            <IconComponent className="menu-icon" />
          </div>
          <span className="menu-label">{item.label}</span>
        </div>
      ),
    };
  });

  return (
    <>
      <div className="brand">
        <img src="/LocalBites.png" alt="LocalBites Logo" className="brand-logo" />
      </div>
      <hr />
      <Menu
        theme="light"
        mode="inline"
        items={renderMenuItems}
        selectedKeys={[selectedKey]}
      />
    </>
  );
}

export default Sidenav;
