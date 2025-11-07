import React, { useState, useEffect } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import {
  Container,
  Button,
  Form,
  Card,
  Tabs,
  Tab,
  Row,
  Col,
  Image,
  Spinner,
} from "react-bootstrap";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Phone,
  MapPin,
  IdCard,
  Briefcase,
  StickyNote,
  Users,
  UserCheck,
} from "lucide-react";
import { getUserById, updateUserProfile, uploadDocument } from "../../api";
import Notification from "../../components/Notification";
import "./StaffProfile.css";

const StaffProfile = () => {
  const location = useLocation();
  const { userId } = location.state || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [originalProfileData, setOriginalProfileData] = useState({});
  const [notification, setNotification] = useState({ message: "", variant: "" });
  const [activeTab, setActiveTab] = useState("basic");
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [documentFiles, setDocumentFiles] = useState({ idFrontImage: null, idBackImage: null });
  const [documentPreviews, setDocumentPreviews] = useState({ idFrontImage: null, idBackImage: null });

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const fetchedUser = await getUserById(userId);
        setUser(fetchedUser);
        setProfileData(fetchedUser.profile || {});
        setOriginalProfileData(fetchedUser.profile || {});
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setNotification({ message: "Error fetching user profile.", variant: "danger" });
      } finally {
        setLoading(false);
      }
    };
    if (userId) getUserProfile();
  }, [userId]);

  const handleInputChange = (field, value) =>
    setProfileData((prev) => ({ ...prev, [field]: value }));

  const handleFileSelect = (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      setDocumentFiles(prev => ({ ...prev, [fieldName]: file }));
      setDocumentPreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    }
  };

  const handleUpload = async (fieldName) => {
    const file = documentFiles[fieldName];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("fieldName", fieldName);

      const result = await uploadDocument(userId, formData);
      setProfileData((prev) => ({ ...prev, [fieldName]: result.fileUrl }));
      setDocumentPreviews(prev => ({ ...prev, [fieldName]: null }));
      setNotification({ message: "Document uploaded successfully.", variant: "success" });
    } catch {
      setNotification({ message: "Error uploading document.", variant: "danger" });
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async () => {
    const changedData = Object.keys(profileData).reduce((acc, key) => {
      if (originalProfileData[key] !== profileData[key]) {
        acc[key] = profileData[key];
      }
      return acc;
    }, {});

    if (Object.keys(changedData).length === 0) {
      return;
    }

    try {
      await updateUserProfile(userId, changedData);
      setNotification({ message: "Profile updated successfully.", variant: "success" });
      setOriginalProfileData(profileData);
    } catch {
      setNotification({ message: "Error updating profile.", variant: "danger" });
    }
  };

  const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalProfileData);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4 staff-profile-container">
      <Notification
        message={notification.message}
        variant={notification.variant}
        onClose={() => setNotification({ message: "", variant: "" })}
      />

      {/* Header Section */}
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
          <h4 className="fw-bold mb-0 text-dark">
            {user?.username || "Staff Profile"}
          </h4>
        </div>

        <Button
          variant="primary"
          className="rounded-pill px-4 shadow-sm"
          onClick={handleProfileUpdate}
          disabled={uploading || !hasChanges}
        >
          {uploading ? "Uploading..." : "Save Changes"}
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="shadow-sm border-0 rounded-4">
        <Card.Body className="p-4">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="modern-tabs mb-3"
          >
            {/* BASIC INFO */}
            <Tab eventKey="basic" title={<><User size={16} className="me-1" /> Basic Info</>}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><User size={16} className="me-2" /> Full Name</Form.Label>
                    <Form.Control
                      value={profileData.fullName || ""}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="John Doe"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><Calendar size={16} className="me-2" /> Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      value={profileData.dateOfBirth || ""}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><Phone size={16} className="me-2" /> Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={profileData.phone || ""}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="0700 000000"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><Mail size={16} className="me-2" /> Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={profileData.personalEmail || ""}
                      onChange={(e) => handleInputChange("personalEmail", e.target.value)}
                      placeholder="email@domain.com"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label><MapPin size={16} className="me-2" /> Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={profileData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Residential address"
                />
              </Form.Group>
            </Tab>

            {/* DOCUMENTS */}
            <Tab eventKey="documents" title={<><IdCard size={16} className="me-1" /> Documents</>}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Type</Form.Label>
                    <Form.Select
                      value={profileData.idType || ""}
                      onChange={(e) => handleInputChange("idType", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="National ID">National ID</option>
                      <option value="Passport">Passport</option>
                      <option value="Driver License">Driver License</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>ID Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileData.idNumber || ""}
                      onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Front ID Image</Form.Label>
                    <div className="d-flex align-items-center">
                        <Form.Label className="btn btn-outline-primary me-2 mb-0">
                            Choose Image
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileSelect(e, "idFrontImage")}
                                hidden
                            />
                        </Form.Label>
                        {documentFiles.idFrontImage && (
                            <Button
                                variant="primary"
                                onClick={() => handleUpload("idFrontImage")}
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </Button>
                        )}
                    </div>
                    {documentPreviews.idFrontImage && (
                        <Image src={documentPreviews.idFrontImage} thumbnail className="mt-2 rounded-3" />
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Back ID Image</Form.Label>
                    <div className="d-flex align-items-center">
                        <Form.Label className="btn btn-outline-primary me-2 mb-0">
                            Choose Image
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileSelect(e, "idBackImage")}
                                hidden
                            />
                        </Form.Label>
                        {documentFiles.idBackImage && (
                            <Button
                                variant="primary"
                                onClick={() => handleUpload("idBackImage")}
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Upload"}
                            </Button>
                        )}
                    </div>
                    {documentPreviews.idBackImage && (
                        <Image src={documentPreviews.idBackImage} thumbnail className="mt-2 rounded-3" />
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

            {/* EMPLOYMENT */}
            <Tab eventKey="employment" title={<><Briefcase size={16} className="me-1" /> Employment</>}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tax ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileData.taxId || ""}
                      onChange={(e) => handleInputChange("taxId", e.target.value)}
                      placeholder="TIN / Tax ID"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Work Permit</Form.Label>
                    <Form.Control
                      value={profileData.workPermit || ""}
                      onChange={(e) => handleInputChange("workPermit", e.target.value)}
                      placeholder="Work permit number or details"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Tab>

            {/* NEXT OF KIN */}
            <Tab eventKey="nextOfKin" title={<><Users size={16} className="me-1" /> Next of Kin</>}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      value={profileData.nextOfKinName || ""}
                      onChange={(e) => handleInputChange("nextOfKinName", e.target.value)}
                      placeholder="Next of Kin's Full Name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact</Form.Label>
                    <Form.Control
                      type="tel"
                      value={profileData.nextOfKinContact || ""}
                      onChange={(e) => handleInputChange("nextOfKinContact", e.target.value)}
                      placeholder="Next of Kin's Contact"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Relationship</Form.Label>
                    <Form.Control
                      value={profileData.nextOfKinRelationship || ""}
                      onChange={(e) => handleInputChange("nextOfKinRelationship", e.target.value)}
                      placeholder="e.g., Spouse, Sibling"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={profileData.nextOfKinAddress || ""}
                  onChange={(e) => handleInputChange("nextOfKinAddress", e.target.value)}
                  placeholder="Next of Kin's Address"
                />
              </Form.Group>
            </Tab>

            {/* NOTES */}
            <Tab eventKey="notes" title={<><StickyNote size={16} className="me-1" /> Notes</>}>
              <Form.Group>
                <Form.Label>Administrative Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={profileData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Private notes about this employee..."
                />
              </Form.Group>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StaffProfile;




// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Container,
//   Button,
//   Form,
//   Card,
//   Tabs,
//   Tab,
//   Row,
//   Col,
//   Image,
//   InputGroup,
//   Spinner,
// } from "react-bootstrap";
// import {
//   ArrowLeft,
//   User,
//   Mail,
//   Calendar,
//   Phone,
//   MapPin,
//   IdCard,
//   Briefcase,
//   StickyNote,
//   UserCheck,
// } from "lucide-react";
// import { getUserById, updateUserProfile, uploadDocument } from "../../api";
// import Notification from "../../components/Notification";
// import "./StaffProfile.css";

// const StaffProfile = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [profileData, setProfileData] = useState({});
//   const [originalProfileData, setOriginalProfileData] = useState({});
//   const [notification, setNotification] = useState({ message: "", variant: "" });
//   const [activeTab, setActiveTab] = useState("basic");
//   const [uploading, setUploading] = useState(false);
//   const [user, setUser] = useState(null);
//   const [documentFiles, setDocumentFiles] = useState({ idFrontImage: null, idBackImage: null });
//   const [documentPreviews, setDocumentPreviews] = useState({ idFrontImage: null, idBackImage: null });

//   useEffect(() => {
//     const getUserProfile = async () => {
//       try {
//         const fetchedUser = await getUserById(userId);
//         setUser(fetchedUser);
//         setProfileData(fetchedUser.profile || {});
//         setOriginalProfileData(fetchedUser.profile || {});
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         setNotification({ message: "Error fetching user profile.", variant: "danger" });
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (userId) getUserProfile();
//   }, [userId]);

//   const handleInputChange = (field, value) =>
//     setProfileData((prev) => ({ ...prev, [field]: value }));

//   const handleFileSelect = (event, fieldName) => {
//     const file = event.target.files[0];
//     if (file) {
//       setDocumentFiles(prev => ({ ...prev, [fieldName]: file }));
//       setDocumentPreviews(prev => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
//     }
//   };

//   const handleUpload = async (fieldName) => {
//     const file = documentFiles[fieldName];
//     if (!file) return;

//     setUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("document", file);
//       formData.append("fieldName", fieldName);

//       const result = await uploadDocument(userId, formData);
//       setProfileData((prev) => ({ ...prev, [fieldName]: result.fileUrl }));
//       setDocumentPreviews(prev => ({ ...prev, [fieldName]: null }));
//       setNotification({ message: "Document uploaded successfully.", variant: "success" });
//     } catch {
//       setNotification({ message: "Error uploading document.", variant: "danger" });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleProfileUpdate = async () => {
//     try {
//       await updateUserProfile(userId, profileData);
//       setNotification({ message: "Profile updated successfully.", variant: "success" });
//       setOriginalProfileData(profileData);
//     } catch {
//       setNotification({ message: "Error updating profile.", variant: "danger" });
//     }
//   };

//   const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalProfileData);

//   if (loading) {
//     return (
//       <Container className="mt-5 text-center">
//         <Spinner animation="border" variant="primary" />
//       </Container>
//     );
//   }

//   return (
//     <Container className="mt-4 staff-profile-container">
//       <Notification
//         message={notification.message}
//         variant={notification.variant}
//         onClose={() => setNotification({ message: "", variant: "" })}
//       />

//       {/* Header Section */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <Button
//           variant="light"
//           className="shadow-sm rounded-pill px-3 d-flex align-items-center"
//           onClick={() => navigate(-1)}
//         >
//           <ArrowLeft size={18} className="me-2" />
//           Back
//         </Button>

//         <div className="d-flex align-items-center">
//           <UserCheck size={22} className="me-2 text-primary" />
//           <h4 className="fw-bold mb-0 text-dark">
//             {user?.username || "Staff Profile"}
//           </h4>
//         </div>

//         <Button
//           variant="primary"
//           className="rounded-pill px-4 shadow-sm"
//           onClick={handleProfileUpdate}
//           disabled={uploading || !hasChanges}
//         >
//           {uploading ? "Uploading..." : "Save Changes"}
//         </Button>
//       </div>

//       {/* Profile Card */}
//       <Card className="shadow-sm border-0 rounded-4">
//         <Card.Body className="p-4">
//           <Tabs
//             activeKey={activeTab}
//             onSelect={(k) => setActiveTab(k)}
//             className="modern-tabs mb-3"
//           >
//             {/* BASIC INFO */}
//             <Tab eventKey="basic" title={<><User size={16} className="me-1" /> Basic Info</>}>
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label><User size={16} className="me-2" /> Full Name</Form.Label>
//                     <Form.Control
//                       value={profileData.fullName || ""}
//                       onChange={(e) => handleInputChange("fullName", e.target.value)}
//                       placeholder="John Doe"
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label><Calendar size={16} className="me-2" /> Date of Birth</Form.Label>
//                     <Form.Control
//                       type="date"
//                       value={profileData.dateOfBirth || ""}
//                       onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label><Phone size={16} className="me-2" /> Phone</Form.Label>
//                     <Form.Control
//                       type="tel"
//                       value={profileData.phone || ""}
//                       onChange={(e) => handleInputChange("phone", e.target.value)}
//                       placeholder="+256 700 000000"
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label><Mail size={16} className="me-2" /> Email</Form.Label>
//                     <Form.Control
//                       type="email"
//                       value={profileData.personalEmail || ""}
//                       onChange={(e) => handleInputChange("personalEmail", e.target.value)}
//                       placeholder="email@domain.com"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <Form.Group className="mb-3">
//                 <Form.Label><MapPin size={16} className="me-2" /> Address</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={2}
//                   value={profileData.address || ""}
//                   onChange={(e) => handleInputChange("address", e.target.value)}
//                   placeholder="Residential address"
//                 />
//               </Form.Group>
//             </Tab>

//             {/* DOCUMENTS */}
//             <Tab eventKey="documents" title={<><IdCard size={16} className="me-1" /> Documents</>}>
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>ID Type</Form.Label>
//                     <Form.Select
//                       value={profileData.idType || ""}
//                       onChange={(e) => handleInputChange("idType", e.target.value)}
//                     >
//                       <option value="">Select</option>
//                       <option value="National ID">National ID</option>
//                       <option value="Passport">Passport</option>
//                       <option value="Driver License">Driver License</option>
//                     </Form.Select>
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>ID Number</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={profileData.idNumber || ""}
//                       onChange={(e) => handleInputChange("idNumber", e.target.value)}
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>

//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Front ID Image</Form.Label>
//                     <div className="d-flex align-items-center">
//                         <Form.Label className="btn btn-outline-primary me-2 mb-0">
//                             Choose Image
//                             <Form.Control
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => handleFileSelect(e, "idFrontImage")}
//                                 hidden
//                             />
//                         </Form.Label>
//                         {documentFiles.idFrontImage && (
//                             <Button
//                                 variant="primary"
//                                 onClick={() => handleUpload("idFrontImage")}
//                                 disabled={uploading}
//                             >
//                                 {uploading ? "Uploading..." : "Upload"}
//                             </Button>
//                         )}
//                     </div>
//                     {documentPreviews.idFrontImage && (
//                         <Image src={documentPreviews.idFrontImage} thumbnail className="mt-2 rounded-3" />
//                     )}
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Back ID Image</Form.Label>
//                     <div className="d-flex align-items-center">
//                         <Form.Label className="btn btn-outline-primary me-2 mb-0">
//                             Choose Image
//                             <Form.Control
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => handleFileSelect(e, "idBackImage")}
//                                 hidden
//                             />
//                         </Form.Label>
//                         {documentFiles.idBackImage && (
//                             <Button
//                                 variant="primary"
//                                 onClick={() => handleUpload("idBackImage")}
//                                 disabled={uploading}
//                             >
//                                 {uploading ? "Uploading..." : "Upload"}
//                             </Button>
//                         )}
//                     </div>
//                     {documentPreviews.idBackImage ? (
//                         <Image src={documentPreviews.idBackImage} thumbnail className="mt-2 rounded-3" />
//                     ) : profileData.idBackImage && (
//                         <Image src={profileData.idBackImage} thumbnail className="mt-2 rounded-3" />
//                     )}
//                   </Form.Group>
//                 </Col>
//               </Row>
//             </Tab>

//             {/* EMPLOYMENT */}
//             <Tab eventKey="employment" title={<><Briefcase size={16} className="me-1" /> Employment</>}>
//               <Row>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Tax ID</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={profileData.taxId || ""}
//                       onChange={(e) => handleInputChange("taxId", e.target.value)}
//                       placeholder="TIN / Tax ID"
//                     />
//                   </Form.Group>
//                 </Col>
//                 <Col md={6}>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Work Permit</Form.Label>
//                     <Form.Control
//                       value={profileData.workPermit || ""}
//                       onChange={(e) => handleInputChange("workPermit", e.target.value)}
//                       placeholder="Work permit number or details"
//                     />
//                   </Form.Group>
//                 </Col>
//               </Row>
//             </Tab>

//             {/* NOTES */}
//             <Tab eventKey="notes" title={<><StickyNote size={16} className="me-1" /> Notes</>}>
//               <Form.Group>
//                 <Form.Label>Administrative Notes</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={5}
//                   value={profileData.notes || ""}
//                   onChange={(e) => handleInputChange("notes", e.target.value)}
//                   placeholder="Private notes about this employee..."
//                 />
//               </Form.Group>
//             </Tab>
//           </Tabs>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default StaffProfile;

