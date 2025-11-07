import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Image,
  Spinner,
  Badge,
} from "react-bootstrap";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  IdCard,
  Briefcase,
  Users,
  StickyNote,
  Download,
  UserCheck,
  Edit3,
} from "lucide-react";
import { getUserById } from "../../api";
//import "./StaffProfileView.css";

const StaffProfileView = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const fetchedUser = await getUserById(userId);
        setUser(fetchedUser);
        setProfileData(fetchedUser.profile || {});
      } catch (error) {
        console.error("Error fetching staff profile:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container className="mt-5 text-center">
        <h5 className="text-muted">No profile data available.</h5>
      </Container>
    );
  }

  return (
    <Container className="mt-4 staff-view-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button
          variant="light"
          className="shadow-sm rounded-pill px-3 d-flex align-items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} className="me-2" />
          Back
        </Button>

        <div className="d-flex align-items-center">
          <UserCheck size={22} className="me-2 text-primary" />
          <h4 className="fw-bold mb-0 text-dark">{user?.username}</h4>
        </div>

        <Button
          variant="outline-primary"
          className="rounded-pill px-4 shadow-sm d-flex align-items-center"
          onClick={() => navigate('/admin/staff/profile', { state: { userId } })}
        >
          <Edit3 size={16} className="me-2" /> Edit Profile
        </Button>
      </div>

      {/* PERSONAL INFO */}
      <Card className="mb-4 shadow-sm border-0 rounded-4">
        <Card.Header className="bg-light fw-semibold d-flex align-items-center">
          <User className="me-2 text-primary" size={18} /> Personal Information
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Full Name:</strong> {profileData.fullName || "-"}</p>
              <p><strong>Date of Birth:</strong> {profileData.dateOfBirth || "-"}</p>
              <p><strong>Phone:</strong> {profileData.phone || "-"}</p>
              <p><strong>Email:</strong> {profileData.personalEmail || "-"}</p>
            </Col>
            <Col md={6}>
              <p><strong>Address:</strong><br />{profileData.address || "-"}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* DOCUMENTS */}
      <Card className="mb-4 shadow-sm border-0 rounded-4">
        <Card.Header className="bg-light fw-semibold d-flex align-items-center">
          <IdCard className="me-2 text-primary" size={18} /> Identification Documents
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>ID Type:</strong> {profileData.idType || "-"}</p>
              <p><strong>ID Number:</strong> {profileData.idNumber || "-"}</p>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={6}>
              {profileData.idFrontImage && (
                <div className="mb-3">
                  <p className="fw-semibold mb-1">Front Image</p>
                  <Image
                    src={profileData.idFrontImage}
                    thumbnail
                    className="rounded-3 mb-2"
                     style={{
    width: "100%",         // responsive
    maxWidth: "250px",     // limit preview width
    height: "180px",       // fixed height for consistency
    objectFit: "cover",    // crop nicely instead of stretching
    objectPosition: "center",
  }}
                  />
                  <div>
                    <a
                      href={profileData.idFrontImage}
                      download
                      className="btn btn-sm btn-outline-primary rounded-pill"
                    >
                      <Download size={14} className="me-1" /> Download
                    </a>
                  </div>
                </div>
              )}
            </Col>

            <Col xs={6}>
              {profileData.idBackImage && (
                <div className="mb-3">
                  <p className="fw-semibold mb-1">Back Image</p>
                  <Image
                    src={profileData.idBackImage}
                    thumbnail
                    className="rounded-3 mb-2"
                     style={{
    width: "100%",         // responsive
    maxWidth: "250px",     // limit preview width
    height: "180px",       // fixed height for consistency
    objectFit: "cover",    // crop nicely instead of stretching
    objectPosition: "center",
  }}
                  />
                  <div>
                    <a
                      href={profileData.idBackImage}
                      download
                      className="btn btn-sm btn-outline-primary rounded-pill"
                    >
                      <Download size={14} className="me-1" /> Download
                    </a>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* EMPLOYMENT */}
      <Card className="mb-4 shadow-sm border-0 rounded-4">
        <Card.Header className="bg-light fw-semibold d-flex align-items-center">
          <Briefcase className="me-2 text-primary" size={18} /> Employment Details
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Tax ID:</strong> {profileData.taxId || "-"}</p>
            </Col>
            <Col md={6}>
              <p><strong>Work Permit:</strong> {profileData.workPermit || "-"}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* NEXT OF KIN */}
      <Card className="mb-4 shadow-sm border-0 rounded-4">
        <Card.Header className="bg-light fw-semibold d-flex align-items-center">
          <Users className="me-2 text-primary" size={18} /> Next of Kin
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Name:</strong> {profileData.nextOfKinName || "-"}</p>
              <p><strong>Contact:</strong> {profileData.nextOfKinContact || "-"}</p>
            </Col>
            <Col md={6}>
              <p><strong>Relationship:</strong> {profileData.nextOfKinRelationship || "-"}</p>
              <p><strong>Address:</strong><br />{profileData.nextOfKinAddress || "-"}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* NOTES */}
      <Card className="mb-5 shadow-sm border-0 rounded-4">
        <Card.Header className="bg-light fw-semibold d-flex align-items-center">
          <StickyNote className="me-2 text-primary" size={18} /> Administrative Notes
        </Card.Header>
        <Card.Body>
          <p className="text-muted">
            {profileData.notes || "No notes added."}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StaffProfileView;
