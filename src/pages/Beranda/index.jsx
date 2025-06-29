import { Col, Row, Typography, Avatar } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCartOutlined,
  FileImageOutlined,
  BookOutlined,
} from "@ant-design/icons";
import "./beranda.css";

const { Title, Text } = Typography;

const iconWrapperStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "8px",
  backgroundColor: "#FFA500",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "10px",
};

const iconStyle = {
  fontSize: "20px",
  color: "#fff",
};

const Beranda = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  return (
    <div className="beranda-container">
      <Row justify="space-between" align="middle" gutter={[32, 0]}>
        <Col xs={24} md={12}>
          <div className="beranda-left">
            <Text className="restaurant-label">- Darurat Team</Text>
            <Title className="headline">
              <span className="fresh-text">🍽️Selamat Datang di </span>{" "}
              <span className="bites-text">LocalBites!</span>
            </Title>
            <Text className="subtitle">
              Eksplorasi Rasa, Cerita, dan Kuliner Singaraja
            </Text>
            <Text className="subtitle-1">
              LocalBites adalah platform berbagi informasi seputar makanan khas,
              rekomendasi tempat makan, resep rumahan, hingga favorit kuliner
              masyarakat di Singaraja dan sekitarnya.
            </Text>
          </div>
        </Col>

        <Col xs={24} md={12} className="beranda-right">
          <div className="image-wrapper">
            <div className="circle-wrapper">
              <img src="/visual.png" alt="Visual" className="main-image" />
            </div>

            {/* Usaha Kuliner */}
            <div className="tag italian" onClick={() => navigate("/usahakuliner")} style={{ cursor: "pointer" }}>
              <div style={iconWrapperStyle}>
                <ShoppingCartOutlined style={iconStyle} />
              </div>
              <div>
                <Text strong>Usaha Kuliner</Text>
                <br />
                <Text>Promosi Makanan</Text>
              </div>
            </div>

            {/* Rekomendasi Sosmed */}
            <div className="tag orders" onClick={() => navigate("/rekomendasisosmed")} style={{ cursor: "pointer" }}>
              <div style={iconWrapperStyle}>
                <FileImageOutlined style={iconStyle} />
              </div>
              <div>
                <Text strong>Rekomendasi Sosmed</Text>
                <br />
                <Text>Viral Kuliner</Text>
              </div>
            </div>

            {/* Resep Masakan */}
            <div className="tag foodies" onClick={() => navigate("/resepmasakan")} style={{ cursor: "pointer" }}>
              <div style={iconWrapperStyle}>
                <BookOutlined style={iconStyle} />
              </div>
              <div>
                <Text strong>Resep Masakan</Text>
                <br />
                <Text>Resep Rumahan</Text>
              </div>
            </div>

          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Beranda;
