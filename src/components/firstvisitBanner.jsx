import { useState, useEffect } from "react";
import { FaEnvelope, FaLinkedin, FaPhone } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import "./FirstVisitBanner.css";

const FirstVisitBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowBanner(true);
    }
  }, []);

  const handleCloseBanner = () => {
    setShowBanner(false);
    localStorage.setItem("hasVisited", "true");
  };

  if (!showBanner) return null;

  return (
    <div className="first-visit-banner">
      <div className="banner-content">
        <button className="close-banner-btn" onClick={handleCloseBanner}>
          <MdClose size={24} />
        </button>
        <h2>Welcome to WisePOS!</h2>
        <p>
          <strong>Heads up:</strong> On your first login, there <strong>might</strong>  be a delay
          of up to <strong>50 seconds</strong>  due to currently hosting on a free server.<br />
          After creating menu items or updating business settings,
          <strong> log out and back in</strong> to refresh cached data.
        </p>
        <p>
          <strong>username:</strong> mkfoods <strong>Password</strong> mkfoods <br />
          <strong>Note: </strong>create other users update their info on new userpage
            using email you used when creating them  <br />
          After creating menu items or updating business settings,
          <strong> log out and back in</strong> to refresh cached data.
        </p>
        <p>
          <strong>Let's collaborate!</strong> Feel free to reach out:
        </p>
        <div className="contact-links">
          <a
            href="mailto:justlikewiseman@gmail.com"
            className="contact-link"
            title="Email"
          >
            <FaEnvelope /> justlikewiseman@gmail.com
          </a>
          <a
            href="https://linkedin.com/in/justlikewiseman"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
            title="LinkedIn"
          >
            <FaLinkedin /> LinkedIn
          </a>
          <a href="tel:+256753145516" className="contact-link" title="Phone">
            <FaPhone /> +256 753 145 516
          </a>
        </div>
      </div>
    </div>
  );
};

export default FirstVisitBanner;
