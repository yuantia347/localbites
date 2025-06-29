/* eslint-disable react/prop-types */
import { useState } from "react";
import { Menu, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import {
  FileImageOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
  BookOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./sidenav.css"; // Import CSS

function Sidenav() {
  const [selectedKey, setSelectedKey] = useState("/beranda");
  const navigate = useNavigate();

  const handleMenuClick = (key) => {
    if (key === "/authentication") {
      navigate("/authentication");
    } else {
      setSelectedKey(key);
      navigate(key);
    }
  };

  const menuItems = [
    { key: "/beranda", icon: HomeOutlined, label: "Beranda" },
    { key: "/usahakuliner", icon: ShoppingCartOutlined, label: "Usaha Kuliner" },
    { key: "/rekomendasisosmed", icon: FileImageOutlined, label: "Rekomendasi" },
    { key: "/resepmasakan", icon: BookOutlined, label: "Resep Masakan" },
    { key: "/favoritsaya", icon: UnorderedListOutlined, label: "Favorit Saya" },
    {
      key: "/authentication",
      icon: LogoutOutlined,
      label: (
        <Popconfirm
          title="Apakah Anda yakin ingin keluar?"
          onConfirm={() => handleMenuClick("/authentication")}
          okText="Ya"
          cancelText="Batal"
        >
          <span>Keluar</span>
        </Popconfirm>
      ),
    },
  ];

  const renderMenuItems = menuItems.map((item) => {
    const isSelected = selectedKey === item.key;
    const IconComponent = item.icon;

    return {
      key: item.key,
      label: (
        <div
          onClick={() =>
            item.key !== "/authentication" && handleMenuClick(item.key)
          }
          className={`menu-item-wrapper ${isSelected ? "active" : ""} ${
            item.key === "/authentication" ? "logout" : ""
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
        <span className="brand-text">LocalBites</span>
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
