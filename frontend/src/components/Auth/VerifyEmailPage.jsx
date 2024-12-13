import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Header from "../../ClientComponent/Header";
import Footer from "../../ClientComponent/Footer";
import { notification } from "antd";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 phút tính bằng giây

  const token = searchParams.get("token");

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setVerificationStatus("failed");
          setErrorMessage(
            "Thời gian xác thực đã hết hạn. Vui lòng yêu cầu lại mã xác thực."
          );
          setShowModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const verifyEmail = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/verify-email",
        { token }
      );
      if (response.status === 200) {
        setVerificationStatus("success");
        notification.success({ message: "Đăng ký thành công" });
        setTimeout(() => navigate("/auth"), 3000);
      }
    } catch (error) {
      setVerificationStatus("failed");
      setErrorMessage("Xác thực email thất bại. Vui lòng thử lại.");
      setShowModal(true);
      setTimeout(() => navigate("/auth"), 2000);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      verifyEmail();
    }, 300000); // 5 phút tính bằng mili giây

    return () => clearTimeout(timeout);
  }, [token]);

  return (
    <>
      <Header /> {/* Thêm Header */}
      <div className="auth-container mt-36">
        <div className="auth-action-left">
          <div className="auth-form-outer">
            <h2 className="auth-form-title">Xác Thực Email</h2>
            <br />
            {verificationStatus === "success" ? (
              <p className="text-success">
                Xác thực email thành công! Bạn sẽ được chuyển hướng về trang
                đăng nhập trong giây lát...
              </p>
            ) : verificationStatus === "failed" ? (
              <p className="text-danger">{errorMessage}</p>
            ) : (
              <div>
                <p>
                  Vui lòng kiểm tra email của bạn và ấn vào liên kết xác thực.
                  Thời gian hết hạn: {Math.floor(countdown / 60)}:
                  {String(countdown % 60).padStart(2, "0")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="auth-action-right">
          <h2 className="welcome-text">Chào mừng đến với Eventify</h2>
          <img
            src="../../public/images/logo.webp"
            alt="Logo"
            className="auth-logo"
          />
        </div>

        {/* Modal thông báo lỗi */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thông báo</Modal.Title>
          </Modal.Header>
          <Modal.Body>{errorMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer /> {/* Thêm Footer */}
    </>
  );
};

export default VerifyEmailPage;
