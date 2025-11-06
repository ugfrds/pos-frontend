import { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Spinner, 
  Form,
  Badge,
  Alert
} from 'react-bootstrap';
import { 
  Save, 
  Settings as SettingsIcon,
  RefreshCw,
  Building,
  DollarSign,
  Receipt,
  Phone,
  MapPin,
  Image,
  Store,
  Shield
} from 'lucide-react';
import CurrencySetting from './CurrencySetting';
import RestaurantNameSetting from './RestaurantNameSetting';
import TaxSetting from './TaxSetting';
import ServiceChargeSetting from './ServiceChargeSetting';
import ReceiptNotesSetting from './ReceiptNotesSetting';
import ContactSetting from './ContactSettings';
import LocationSetting from './LocationSettings';
import LogoSetting from './LogoSetting';
import BusinessTypeSetting from './BusinessTypeSetting';
import Notification from '../Notification';
import { getSettings, saveSettings } from '../../api';
//import '../styles/SettingsPage.css';

const SettingsPage = () => {
    const [currency, setCurrency] = useState('UGX');
    const [name, setName] = useState('My Restaurant');
    const [taxPercentage, setTaxPercentage] = useState(0);
    const [serviceChargeEnabled, setServiceChargeEnabled] = useState(false);
    const [serviceCharge, setServiceCharge] = useState(0);
    const [receiptNotes, setReceiptNotes] = useState('Thank you for dining with us!');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');
    const [logo, setLogo] = useState(null);
    const [businessType, setBusinessType] = useState('');
    const [notification, setNotification] = useState({ message: '', variant: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [originalSettings, setOriginalSettings] = useState(null); // To store initial fetched settings

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const fetchedSettings = await getSettings();
                if (fetchedSettings) {
                    setCurrency(fetchedSettings.currency ?? 'UGX');
                    setName(fetchedSettings.name ?? 'My Restaurant');
                    setTaxPercentage(fetchedSettings.taxPercentage ?? 10);
                    setServiceChargeEnabled(fetchedSettings.serviceChargeEnabled ?? false);
                    setServiceCharge(fetchedSettings.serviceCharge ?? 0);
                    setReceiptNotes(fetchedSettings.receiptNotes ?? 'Thank you for dining with us!');
                    setPhoneNumber(fetchedSettings.phoneNumber ?? '');
                    setLocation(fetchedSettings.location ?? '');
                    setLogo(fetchedSettings.logo ?? null);
                    setBusinessType(fetchedSettings.businessType ?? '');
                    setOriginalSettings(fetchedSettings); // Store original fetched settings
                    setHasUnsavedChanges(false); // No unsaved changes after initial fetch
                }
            } catch (error) {
                setNotification({ message: 'Failed to fetch settings.', variant: 'danger' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Track changes for unsaved changes indicator
    useEffect(() => {
        if (!originalSettings) return; // Don't check until original settings are loaded

        const currentSettings = {
            currency,
            name,
            taxPercentage,
            serviceChargeEnabled,
            serviceCharge,
            receiptNotes,
            phoneNumber,
            location,
            logo,
            businessType,
        };

        const changesMade = Object.keys(currentSettings).some(key => {
            // Special handling for logo as it can be an object or null
            if (key === 'logo') {
                // Compare logo objects or nulls
                if (currentSettings.logo === null && originalSettings.logo === null) return false;
                if (currentSettings.logo === null || originalSettings.logo === null) return true;
                // Assuming logo objects can be compared by a unique identifier or stringified
                return JSON.stringify(currentSettings.logo) !== JSON.stringify(originalSettings.logo);
            }
            return currentSettings[key] !== originalSettings[key];
        });
        
        setHasUnsavedChanges(changesMade);
    }, [currency, name, taxPercentage, serviceChargeEnabled, serviceCharge, receiptNotes, phoneNumber, location, logo, businessType, originalSettings]);

    const handleSaveSettings = async () => {
        const settings = {
            currency,
            name,
            taxPercentage,
            serviceChargeEnabled,
            serviceCharge,
            receiptNotes,
            phoneNumber,
            location,
            logo,
            businessType,
        };

        try {
            setIsLoading(true);
            const success = await saveSettings(settings);
            if (success) {
                setNotification({ message: 'Settings updated successfully!', variant: 'success' });
                setHasUnsavedChanges(false);
                setOriginalSettings(settings); // Update original settings to reflect the new saved state
            } else {
                setNotification({ message: 'Failed to save settings. Please try again.', variant: 'danger' });
            }
        } catch (error) {
            setNotification({ message: 'An error occurred while saving settings.', variant: 'danger' });
        } finally {
            setIsLoading(false);
        }
    };

    const SettingSection = ({ title, description, icon: Icon, children, badge }) => (
        <Card className="setting-section h-100">
            <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-3">
                    <div className="section-icon me-3">
                        <Icon size={24} />
                    </div>
                    <div className="flex-grow-1">
                        <Card.Title className="h5 mb-1 d-flex align-items-center">
                            {title}
                            {badge && <Badge bg="warning" className="ms-2">{badge}</Badge>}
                        </Card.Title>
                        <Card.Text className="text-muted small mb-0">{description}</Card.Text>
                    </div>
                </div>
                {children}
            </Card.Body>
        </Card>
    );

    return (
        <Container fluid className="settings-page">
            {/* Header Section */}
            <Card className="settings-header mb-4">
                <Card.Body className="p-4">
                    <Row className="align-items-center">
                        <Col>
                            <div className="d-flex align-items-center">
                                <div className="header-icon me-3">
                                    <SettingsIcon size={32} />
                                </div>
                                <div>
                                    <h1 className="h2 mb-1 gradient-text">Business Settings</h1>
                                    <p className="text-muted mb-0">
                                        Manage your business configuration and preferences
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col xs="auto">
                            <div className="d-flex gap-2 align-items-center">
                                {hasUnsavedChanges && (
                                    <Badge bg="warning" className="me-2">
                                        Unsaved Changes
                                    </Badge>
                                )}
                                <Button 
                                    variant="primary" 
                                    onClick={handleSaveSettings}
                                    disabled={isLoading || !hasUnsavedChanges}
                                    className="d-flex align-items-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <RefreshCw className="me-2 spinning" size={18} />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="me-2" size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Notification */}
            <Notification
                message={notification.message}
                variant={notification.variant}
                onClose={() => setNotification({ message: '', variant: '' })}
            />

            {isLoading && !notification.message ? (
                <Card className="text-center my-5">
                    <Card.Body className="py-5">
                        <Spinner animation="border" variant="primary" className="mb-3" />
                        <h5>Loading settings...</h5>
                        <p className="text-muted">Please wait while we load your configuration</p>
                    </Card.Body>
                </Card>
            ) : (
                <>
                    {/* Business Information Section */}
                    <Row className="g-3 mb-4">
                        <Col lg={12}>
                            <h4 className="section-title mb-3">
                                <Building className="me-2" size={20} />
                                Business Information
                            </h4>
                        </Col>
                        
                        <Col xl={4} lg={6}>
                            <SettingSection
                                title="Business Details"
                                description="Configure your business name and type"
                                icon={Building}
                                badge="Required"
                            >
                                <RestaurantNameSetting name={name} onNameChange={setName} />
                                <div className="mt-3">
                                    <BusinessTypeSetting
                                        businessType={businessType}
                                        onBusinessTypeChange={setBusinessType}
                                    />
                                </div>
                            </SettingSection>
                        </Col>

                        <Col xl={4} lg={6}>
                            <SettingSection
                                title="Contact & Location"
                                description="Set up your contact information and business location"
                                icon={MapPin}
                            >
                                <ContactSetting phone={phoneNumber} onPhone={setPhoneNumber} />
                                <div className="mt-3">
                                    <LocationSetting location={location} onLocationChange={setLocation} />
                                </div>
                            </SettingSection>
                        </Col>

                        <Col xl={4} lg={6}>
                            <SettingSection
                                title="Brand Identity"
                                description="Upload your logo and customize branding"
                                icon={Image}
                            >
                                <LogoSetting logo={logo} onLogoChange={setLogo} />
                            </SettingSection>
                        </Col>
                    </Row>

                    {/* Financial Settings Section */}
                    <Row className="g-3 mb-4">
                        <Col lg={12}>
                            <h4 className="section-title mb-3">
                                <DollarSign className="me-2" size={20} />
                                Financial Settings
                            </h4>
                        </Col>

                        <Col xl={4} lg={6}>
                            <SettingSection
                                title="Currency & Pricing"
                                description="Set your preferred currency and tax settings"
                                icon={DollarSign}
                                badge="Important"
                            >
                                <CurrencySetting currency={currency} onCurrencyChange={setCurrency} />
                                <div className="mt-3">
                                    <TaxSetting
                                        taxPercentage={taxPercentage}
                                        onTaxChange={(value) =>
                                            setTaxPercentage(Math.max(0, Math.min(100, value)))
                                        }
                                    />
                                </div>
                            </SettingSection>
                        </Col>

                        <Col xl={4} lg={6}>
                            <SettingSection
                                title="Service Charges"
                                description="Configure service charges and fees"
                                icon={Store}
                            >
                                <ServiceChargeSetting
                                    serviceCharge={serviceCharge}
                                    serviceChargeEnabled={serviceChargeEnabled}
                                    onServiceChargeChange={setServiceCharge}
                                    onToggleServiceCharge={setServiceChargeEnabled}
                                />
                            </SettingSection>
                        </Col>

                        <Col xl={4} lg={6}>
                            <SettingSection
                                title="Receipt Configuration"
                                description="Customize receipt notes and formatting"
                                icon={Receipt}
                            >
                                <ReceiptNotesSetting notes={receiptNotes} onNotesChange={setReceiptNotes} />
                            </SettingSection>
                        </Col>
                    </Row>

                    {/* Quick Settings Overview */}
                    <Row className="g-3">
                        <Col lg={12}>
                            <h4 className="section-title mb-3">
                                <Shield className="me-2" size={20} />
                                Configuration Overview
                            </h4>
                        </Col>
                        
                        <Col md={6} lg={3}>
                            <Card className="config-card text-center">
                                <Card.Body className="p-3">
                                    <DollarSign className="text-primary mb-2" size={24} />
                                    <h6 className="mb-1">Currency</h6>
                                    <p className="config-value">{currency}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={6} lg={3}>
                            <Card className="config-card text-center">
                                <Card.Body className="p-3">
                                    <Building className="text-success mb-2" size={24} />
                                    <h6 className="mb-1">Tax Rate</h6>
                                    <p className="config-value">{taxPercentage}%</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={6} lg={3}>
                            <Card className="config-card text-center">
                                <Card.Body className="p-3">
                                    <Store className="text-warning mb-2" size={24} />
                                    <h6 className="mb-1">Service Charge</h6>
                                    <p className="config-value">
                                        {serviceChargeEnabled ? `${serviceCharge}%` : 'Disabled'}
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        <Col md={6} lg={3}>
                            <Card className="config-card text-center">
                                <Card.Body className="p-3">
                                    <Phone className="text-info mb-2" size={24} />
                                    <h6 className="mb-1">Contact</h6>
                                    <p className="config-value">
                                        {phoneNumber || 'Not Set'}
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Save Button Footer */}
                    {hasUnsavedChanges && (
                        <Card className="save-footer mt-4">
                            <Card.Body className="py-3">
                                <Row className="align-items-center">
                                    <Col>
                                        <div className="d-flex align-items-center">
                                            <Alert variant="warning" className="mb-0 py-2">
                                                <strong>You have unsaved changes!</strong> Don't forget to save your settings.
                                            </Alert>
                                        </div>
                                    </Col>
                                    <Col xs="auto">
                                        <Button 
                                            variant="success" 
                                            size="lg"
                                            onClick={handleSaveSettings}
                                            disabled={isLoading}
                                            className="d-flex align-items-center"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <RefreshCw className="me-2 spinning" size={18} />
                                                    Saving Changes...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="me-2" size={18} />
                                                    Save All Settings
                                                </>
                                            )}
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}
                </>
            )}
        </Container>
    );
};

export default SettingsPage;