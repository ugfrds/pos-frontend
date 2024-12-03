///settings page 
import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CurrencySetting from './CurrencySetting';
import RestaurantNameSetting from './RestaurantNameSetting';
import TaxSetting from './TaxSetting';
import ServiceChargeSetting from './ServiceChargeSetting';
import ReceiptNotesSetting from './ReceiptNotesSetting';
import ContactSetting from './contactSettings';
import { getSettings, saveSettings } from '../../api';


const SettingsPage = () => {
    const [currency, setCurrency] = useState('USD');
    const [name,setName] = useState('My Restaurant');
    const [taxPercentage, setTaxPercentage] = useState(10);
    const [serviceChargeEnabled, setServiceChargeEnabled] = useState(false);
    const [serviceCharge, setServiceCharge] = useState(0);
    const [receiptNotes, setReceiptNotes] = useState('Thank you for dining with us!');
    const [phoneNumber, setPhoneNumber]= useState('')

    useEffect(() => {
        // Fetch current settings from the backend
        const fetchSettings = async () => {
            const settings = await getSettings(); 
            if (settings) {
                setCurrency(settings.currency || 'UGX');
                setName(settings.name || 'My Restaurant');
                setTaxPercentage(settings.taxPercentage || 10);
                setServiceChargeEnabled(settings.serviceChargeEnabled || false);
                setServiceCharge(settings.serviceCharge || 0);
                setReceiptNotes(settings.receiptNotes || 'Thank you for dining with us!');
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
        };
        
        const success = await saveSettings(settings);
        if (success) {
            alert('Settings saved successfully!');
            
        } else {
            alert('Failed to save settings.');
        }
    };

    return (
        <Container>
            <h2 className="text-center mb-4">Settings</h2>
            <Row>
                <Col md={6}>
                    <CurrencySetting currency={currency} onCurrencyChange={setCurrency} />
                </Col>
                <Col md={6}>
                    <RestaurantNameSetting name={name} onNameChange={setName} />
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <TaxSetting taxPercentage={taxPercentage} onTaxChange={setTaxPercentage} />
                </Col>
                <Col md={6}>
                    <ServiceChargeSetting 
                        serviceCharge={serviceCharge}
                        serviceChargeEnabled={serviceChargeEnabled}
                        onServiceChargeChange={setServiceCharge}
                        onToggleServiceCharge={setServiceChargeEnabled}
                    />
                </Col>
            </Row>
            <Row> 
                <Col>
                    <ContactSetting phone={phoneNumber} onPhone={setPhoneNumber} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <ReceiptNotesSetting notes={receiptNotes} onNotesChange={setReceiptNotes} />
                </Col>
            </Row>
            <Button variant="primary" className="mt-4" onClick={handleSaveSettings}>Save Settings</Button>
        </Container>
    );
};

export default SettingsPage;