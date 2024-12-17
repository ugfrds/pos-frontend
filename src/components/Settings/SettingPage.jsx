import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form } from 'react-bootstrap';
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

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const settings = await getSettings();
                if (settings) {
                    setCurrency(settings.currency ?? 'UGX');
                    setName(settings.name ?? 'My Restaurant');
                    setTaxPercentage(settings.taxPercentage ?? 10);
                    setServiceChargeEnabled(settings.serviceChargeEnabled ?? false);
                    setServiceCharge(settings.serviceCharge ?? 0);
                    setReceiptNotes(settings.receiptNotes ?? 'Thank you for dining with us!');
                    setPhoneNumber(settings.phoneNumber ?? '');
                    setLocation(settings.location ?? '');
                    setLogo(settings.logo ?? null);
                    setBusinessType(settings.businessType ?? '');
                    
                }
            } catch (error) {
                setNotification({ message: 'Failed to fetch settings.', variant: 'danger' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

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
            const success = await saveSettings(settings);
            if (success) {
                setNotification({ message: 'Settings updated successfully.', variant: 'success' });
            } else {
                setNotification({ message: 'Failed to save settings.', variant: 'danger' });
            }
        } catch (error) {
            setNotification({ message: 'An error occurred while saving settings.', variant: 'danger' });
        }
    };

    return (
        <Container className='h-100'>
            <header className="bg-primary text-white text-center py-3 mb-4 rounded">
                <h2>Settings</h2>
            </header>
            <Notification
                message={notification.message}
                variant={notification.variant}
                onClose={() => setNotification({ message: '', variant: '' })}
            />
            {isLoading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    <Row className="g-4">
                        <Col md={4}>
                            <Card className="p-3 shadow-sm">
                                <CurrencySetting currency={currency} onCurrencyChange={setCurrency} />
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="p-3 shadow-sm">
                                <RestaurantNameSetting name={name} onNameChange={setName} />
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="p-3 shadow-sm">
                                <TaxSetting
                                    taxPercentage={taxPercentage}
                                    onTaxChange={(value) =>
                                        setTaxPercentage(Math.max(0, Math.min(100, value)))
                                    }
                                />
                            </Card>
                        </Col>
                    </Row>
                    <Row className="g-4 mt-2">
                        <Col md={4}>
                            <Card className="p-3 shadow-sm">
                                <ServiceChargeSetting
                                    serviceCharge={serviceCharge}
                                    serviceChargeEnabled={serviceChargeEnabled}
                                    onServiceChargeChange={setServiceCharge}
                                    onToggleServiceCharge={setServiceChargeEnabled}
                                />
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="p-3 shadow-sm">
                                <ContactSetting phone={phoneNumber} onPhone={setPhoneNumber} />
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="p-3 shadow-sm">
                                <LocationSetting location={location} onLocationChange={setLocation} />
                            </Card>
                        </Col>
                    </Row>
                    <Row className="g-4 mt-2">
                        <Col md={6}>
                            <Card className="p-3 shadow-sm">
                                <LogoSetting logo={logo} onLogoChange={setLogo} />
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="p-3 shadow-sm">
                                <BusinessTypeSetting
                                    businessType={businessType}
                                    onBusinessTypeChange={setBusinessType}
                                />
                            </Card>
                        </Col>
                    </Row>
                    <Row className="g-4 mt-2">
                        <Col>
                            <Card className="p-3 shadow-sm">
                                <ReceiptNotesSetting notes={receiptNotes} onNotesChange={setReceiptNotes} />
                            </Card>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end my-4">
                        <Button variant="success" size="lg" onClick={handleSaveSettings}>
                            Save Settings
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
};

export default SettingsPage;
