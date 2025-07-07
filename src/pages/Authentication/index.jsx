import { useState, useContext } from 'react';
import './authentication.css';
import { registerUser, sendData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import { notification } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { jwtStorage } from '../../utils/jwt_storage';

export default function Authentication() {
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [api, contextHolder] = notification.useNotification();

  const toggleForm = () => setIsRegistering(!isRegistering);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('username', formData.username);
    form.append('password', formData.password);

    try {
      const response = await registerUser(form);
      if (response?.message) {
        api.success({ message: 'Registrasi Berhasil', description: response.message });
        setFormData({ username: '', password: '' });
      } else {
        api.error({ message: 'Gagal Registrasi', description: 'Terjadi kesalahan saat registrasi.' });
      }
    } catch (error) {
      console.error('Register error:', error);
      api.error({ message: 'Server Error', description: 'Terjadi kesalahan pada server.' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("username", loginData.username);
    form.append("password", loginData.password);

    try {
      const response = await sendData("/api/v1/auth/login", form);
      if (response && typeof response === "object" && "access_token" in response) {
        login(response.access_token);
        await jwtStorage.storeToken(response.access_token);
        localStorage.setItem("id_users", response.user_id);
        api.success({ message: "Login Berhasil", description: "Anda berhasil masuk." });
        navigate("/beranda");
      } else {
        failedLogin();
      }
    } catch (error) {
      console.error("Login error:", error);
      failedLogin();
    }
  };

  const failedLogin = () => {
    api.error({ message: 'Login Gagal', description: 'Username atau password salah.' });
  };

  return (
    <>
      {contextHolder}
      <div className="auth-body">
        <div className={`container ${isRegistering ? 'active' : ''}`} id="container">
          {/* Register */}
          <div className="form-container sign-up">
            <form onSubmit={handleRegister}>
              <h1>Buat Akun</h1>
              <span>Gunakan nama pengguna dan kata sandi untuk mendaftar</span>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                >
                  {showRegisterPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              </div>
              <button type="submit">Daftar</button>
            </form>
          </div>

          {/* Login */}
          <div className="form-container sign-in">
            <form onSubmit={handleLogin}>
              <h1>Masuk</h1>
              <span>Gunakan nama pengguna dan kata sandi untuk masuk</span>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              </div>
              <button type="submit">Masuk</button>
            </form>
          </div>

          {/* Toggle */}
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <div className="circle-carousel">
                  {[1, 2, 3, 4, 5, 6].map((num, index) => (
                    <img key={num} src={`/food${num}.png`} alt={`food${num}`} className={`circle-image circle-image-${index + 1}`} />
                  ))}
                </div>
                <h1>Selamat Datang Kembali!</h1>
                <p>Masukkan kredensial Anda untuk masuk</p>
                <button className="hidden" onClick={toggleForm}>Masuk</button>
              </div>

              <div className="toggle-panel toggle-right">
                <div className="circle-carousel">
                  {[1, 2, 3, 4, 5, 6].map((num, index) => (
                    <img key={num} src={`/food${num}.png`} alt={`food${num}`} className={`circle-image circle-image-${index + 1}`} />
                  ))}
                </div>
                <h1>Halo, Teman Local Bites!</h1>
                <p>Daftar untuk mengakses sistem</p>
                <button className="hidden" onClick={toggleForm}>Daftar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
