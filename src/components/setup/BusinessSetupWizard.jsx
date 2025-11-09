import React, { useState } from 'react';
import {
    Container,
    Card,
    Button,
    ProgressBar,
    Row,
    Col,
    Alert,
    Badge,
    Spinner,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap';
import {
    Building2,
    Users,
    Settings,
    MenuSquare,
    CheckCircle2,
    XCircle,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBusinessSetup } from '../../context/BusinessSetupContext';
import { fetchMenuItems } from '../../api';
import { UserBusinessContext } from '../../context/UserBusinessContext';
import { useContext } from 'react';

const BusinessSetupWizard = () => {
    const { setupState, closeWizard, setCurrentStep, completeSetupStep } = useBusinessSetup();
    const { business } = useContext(UserBusinessContext);
    const navigate = useNavigate();
    const [validating, setValidating] = useState(false);
    const [error, setError] = useState('');

    const steps = [
        {
            id: 'businessInfo',
            title: 'Business Information',
            icon: <Building2 size={24} />,
            description: 'Set up your business name and type',
            route: '/admin/settings',
            completed: setupState.setupSteps.businessInfo,
            required: true,
            validate: async () => {
                if (!business?.settings?.name || !business?.settings?.businessType) {
                    throw new Error('Please set your business name and type');
                }
                return true;
            }
        },
        {
            id: 'menuItems',
            title: 'Menu Items',
            icon: <MenuSquare size={24} />,
            description: 'Add your products or services to the menu',
            route: '/admin/manage-menu',
            completed: setupState.setupSteps.menuItems,
            required: true,
            validate: async () => {
                const items = await fetchMenuItems();
                if (!items || items.length === 0) {
                    throw new Error('Please add at least one menu item');
                }
                return true;
            }
        },
        {
            id: 'users',
            title: 'Staff Management',
            icon: <Users size={24} />,
            description: 'Optional: Add staff members if you have any',
            route: '/admin/staff',
            completed: setupState.setupSteps.users,
            required: false,
            skipValidation: true, // Can be marked complete without validation
            info: 'This step is optional. Skip if you run your business solo.'
        },
        {
            id: 'taxSettings',
            title: 'Tax & Payment Settings',
            icon: <Settings size={24} />,
            description: 'Configure tax rates and payment options',
            route: '/admin/settings',
            completed: setupState.setupSteps.taxSettings,
            required: true,
            validate: async () => {
                if (business?.settings?.taxPercentage === undefined || 
                    !business?.settings?.currency) {
                    throw new Error('Please set your tax rate and currency');
                }
                return true;
            }
        }
    ];

    // Only count required steps for progress
    const requiredSteps = steps.filter(step => step.required);
    const completedRequiredSteps = requiredSteps.filter(step => setupState.setupSteps[step.id]);
    const progress = (completedRequiredSteps.length / requiredSteps.length) * 100;

    const handleStepClick = (step) => {
        setCurrentStep(step.id);
        navigate(step.route);
    };

    const handleMarkComplete = async (step) => {
        setValidating(true);
        setError('');
        try {
            if (!step.skipValidation) {
                await step.validate();
            }
            completeSetupStep(step.id);
        } catch (err) {
            setError(err.message);
        } finally {
            setValidating(false);
        }
    };

    return (
        <Container className="py-5">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Business Setup Wizard</h4>
                        <Button variant="outline-light" size="sm" onClick={closeWizard}>
                            Skip Setup <XCircle size={16} className="ms-2" />
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <ProgressBar 
                        now={progress} 
                        className="mb-4"
                        label={`${Math.round(progress)}% of required steps complete`}
                    />
                    
                    {error && (
                        <Alert variant="warning" className="mb-4">
                            <AlertCircle size={20} className="me-2" />
                            {error}
                        </Alert>
                    )}

                    <Row className="g-4">
                        {steps.map((step, index) => (
                            <Col md={12} key={step.id}>
                                <Card 
                                    className={`setup-step ${setupState.currentStep === step.id ? 'border-primary' : ''}`}
                                >
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col xs="auto">
                                                <div className={`step-icon ${step.completed ? 'bg-success' : 'bg-primary'}`}>
                                                    {step.completed ? <CheckCircle2 size={24} /> : step.icon}
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="d-flex align-items-center gap-2">
                                                    <h5 className="mb-1">
                                                        {step.title}
                                                        {!step.required && (
                                                            <Badge bg="info" className="ms-2">Optional</Badge>
                                                        )}
                                                    </h5>
                                                    {step.info && (
                                                        <OverlayTrigger
                                                            placement="top"
                                                            overlay={<Tooltip>{step.info}</Tooltip>}
                                                        >
                                                            <Info size={16} className="text-muted" />
                                                        </OverlayTrigger>
                                                    )}
                                                </div>
                                                <p className="text-muted mb-0">{step.description}</p>
                                            </Col>
                                            <Col xs="auto" className="d-flex align-items-center gap-2">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => handleStepClick(step)}
                                                >
                                                    Configure
                                                    <ArrowRight size={16} className="ms-2" />
                                                </Button>
                                                {!step.completed && (
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => handleMarkComplete(step)}
                                                        disabled={validating}
                                                    >
                                                        {validating ? (
                                                            <Spinner size="sm" animation="border" className="me-2" />
                                                        ) : (
                                                            <CheckCircle2 size={16} className="me-2" />
                                                        )}
                                                        {step.skipValidation ? 'Skip Step' : 'Mark Complete'}
                                                    </Button>
                                                )}
                                                {step.completed && (
                                                    <Badge bg="success">Completed</Badge>
                                                )}
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {progress === 100 && (
                        <Alert variant="success" className="mt-4">
                            <CheckCircle2 size={24} className="me-2" />
                            Congratulations! You've completed all required setup steps. Your business is ready to go!
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BusinessSetupWizard;