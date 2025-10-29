import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBusiness } from '../../api';


const BusinessPage = () => {
  const [businessName, setBusinessName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await createBusiness( contactEmail,businessName);
      console.log('Business created successfully:', data);
      navigate('/superadmin/manage-businesses')
  } catch (error) {
      console.error(`Failed to create business:, ${error}`);
  }
  }

  return (
    <div className="container mt-5">
      {/* Back Button */}
      <button className="btn btn-secondary mb-3" onClick={handleBack} disabled={loading}>
        &larr; Back
      </button>
      {/* Logo */}
      <div className="text-center mb-4">
        <h1 className="text-danger">wisePOS</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Add New Business</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="businessName" className="form-label">Business Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="businessName"
                    placeholder="Enter business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contactEmail" className="form-label"> Owner's Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="contactEmail"
                    placeholder="Enter owner's email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Creating Business...' : 'Create Business'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;
