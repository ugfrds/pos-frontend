import BusinessSetupWizard from './BusinessSetupWizard';

// This file intentionally re-exports the more feature-rich BusinessSetupWizard.
// Keeping this small wrapper preserves existing imports throughout the app
// and avoids duplicating the wizard implementation.
export default BusinessSetupWizard;