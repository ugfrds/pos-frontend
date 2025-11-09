import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserBusinessContext } from './UserBusinessContext';
import { fetchMenuItems } from '../api';

export const BusinessSetupContext = createContext();

export const BusinessSetupProvider = ({ children }) => {
    const { business } = useContext(UserBusinessContext);

    const getInitialState = () => {
        try {
            const saved = localStorage.getItem('businessSetupState');
            if (saved) return JSON.parse(saved);
        } catch (e) {
            // ignore parse errors
        }

        return {
            isNewBusiness: true,
            setupSteps: {
                businessInfo: false,
                menuItems: false,
                users: false,
                taxSettings: false,
            },
            showWizard: true,
            currentStep: 'businessInfo',
            completedRequiredSteps: 0,
            totalRequiredSteps: 3,
        };
    };

    const [setupState, setSetupState] = useState(getInitialState);

    const persistState = (state) => {
        try {
            localStorage.setItem('businessSetupState', JSON.stringify(state));
        } catch (e) {
            console.error('Failed to persist business setup state', e);
        }
    };

    const checkBusinessSetup = async () => {
        try {
            const menuItems = await fetchMenuItems();

            const businessInfoComplete = Boolean(
                business?.settings?.name && business?.settings?.businessType
            );

            const taxSettingsComplete =
                business?.settings?.taxPercentage !== undefined && Boolean(business?.settings?.currency);

            const hasMenuItems = Array.isArray(menuItems) && menuItems.length > 0;

                    const isNewBusiness = !(businessInfoComplete && hasMenuItems && taxSettingsComplete);

                    const completionStatus = {
                        businessInfo: businessInfoComplete,
                        menuItems: hasMenuItems,
                        users: true, // optional: treat as not required by default
                        taxSettings: taxSettingsComplete,
                    };

                    const completedRequired = [businessInfoComplete, hasMenuItems, taxSettingsComplete].filter(Boolean).length;

                    const newState = {
                        ...setupState,
                        isNewBusiness,
                        setupSteps: completionStatus,
                        completedRequiredSteps: completedRequired,
                        totalRequiredSteps: 3,
                    };

            setSetupState(newState);
            persistState(newState);
        } catch (error) {
            console.error('Error checking business setup:', error);
        }
    };

    useEffect(() => {
        checkBusinessSetup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [business]);

    const completeSetupStep = (step) => {
        setSetupState((prev) => {
            // avoid double-counting a step already completed
            const wasCompleted = Boolean(prev.setupSteps?.[step]);

            const newSteps = {
                ...prev.setupSteps,
                [step]: true,
            };

            const isRequired = step !== 'users';
            const completedRequired = wasCompleted
                ? prev.completedRequiredSteps
                : isRequired
                ? prev.completedRequiredSteps + 1
                : prev.completedRequiredSteps;

            const newState = {
                ...prev,
                setupSteps: newSteps,
                completedRequiredSteps: completedRequired,
            };

            persistState(newState);
            return newState;
        });
    };

    const closeWizard = () => {
        setSetupState((prev) => {
            const newState = { ...prev, showWizard: false };
            persistState(newState);
            return newState;
        });
    };

    const reopenWizard = () => {
        setSetupState((prev) => {
            const newState = { ...prev, showWizard: true };
            persistState(newState);
            return newState;
        });
    };

    const setCurrentStep = (step) => {
        setSetupState((prev) => {
            const newState = { ...prev, currentStep: step };
            persistState(newState);
            return newState;
        });
    };

    const resetSetup = () => {
        const initial = getInitialState();
        setSetupState(initial);
        persistState(initial);
    };

    const value = {
        setupState,
        completeSetupStep,
        closeWizard,
        reopenWizard,
        setCurrentStep,
        checkBusinessSetup,
        resetSetup,
    };

    return <BusinessSetupContext.Provider value={value}>{children}</BusinessSetupContext.Provider>;
};

export const useBusinessSetup = () => useContext(BusinessSetupContext);