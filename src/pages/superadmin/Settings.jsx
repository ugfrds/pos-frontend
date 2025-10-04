import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [siteName, setSiteName] = useState('');
  const [siteEmail, setSiteEmail] = useState('');
  const [siteLogo, setSiteLogo] = useState(null);
  const [notificationEmail, setNotificationEmail] = useState('');
  const [passwordPolicy, setPasswordPolicy] = useState('Strong'); // Example setting
  const [enable2FA, setEnable2FA] = useState(false);
  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    // Add logic to save settings to the server
    console.log({
      siteName,
      siteEmail,
      siteLogo,
      notificationEmail,
      passwordPolicy,
      enable2FA
    });
  };

  return (
    <div className="container mt-5">
      {/* Back Button */}
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </button>

      {/* Logo */}
      <div className="text-center mb-4">
        <h1 className="text-danger">wisePOS</h1>
      </div>

      <h2>Settings</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label htmlFor="siteName" className="form-label">Site Name</label>
          <input
            type="text"
            className="form-control"
            id="siteName"
            placeholder="Enter site name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="siteEmail" className="form-label">Site Email</label>
          <input
            type="email"
            className="form-control"
            id="siteEmail"
            placeholder="Enter site email"
            value={siteEmail}
            onChange={(e) => setSiteEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="siteLogo" className="form-label">Site Logo</label>
          <input
            type="file"
            className="form-control"
            id="siteLogo"
            onChange={(e) => setSiteLogo(e.target.files[0])}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="notificationEmail" className="form-label">Notification Email</label>
          <input
            type="email"
            className="form-control"
            id="notificationEmail"
            placeholder="Enter notification email"
            value={notificationEmail}
            onChange={(e) => setNotificationEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordPolicy" className="form-label">Password Policy</label>
          <select
            className="form-control"
            id="passwordPolicy"
            value={passwordPolicy}
            onChange={(e) => setPasswordPolicy(e.target.value)}
          >
            <option value="Weak">Weak</option>
            <option value="Medium">Medium</option>
            <option value="Strong">Strong</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="enable2FA" className="form-check-label">Enable Two-Factor Authentication</label>
          <input
            type="checkbox"
            id="enable2FA"
            checked={enable2FA}
            onChange={() => setEnable2FA(!enable2FA)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Settings</button>
      </form>

      {/* Footer */}
      <footer className="text-center mt-5">
        <p className="text-danger">© 2024 Wisecorp Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Settings;
