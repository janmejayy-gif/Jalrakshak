import { useAuth } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Input, Select } from '../components/common';

export function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="page-content max-w-2xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-primary">Profile</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={user?.fullName || ''}
              disabled
            />
            <Input
              label="Email"
              type="email"
              value={user?.email || ''}
              disabled
            />
          </div>
          <Input
            label="Phone"
            type="tel"
            value={user?.phone || ''}
            disabled
          />
          <Select
            label="Preferred Language"
            options={[
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'Hindi (हिन्दी)' },
              { value: 'mr', label: 'Marathi (मराठी)' },
            ]}
            value={user?.preferredLanguage || 'en'}
            disabled
          />
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-semibold text-primary">Account</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-muted">Update your password for security.</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/change-password')}>
              Change Password
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border-light">
            <div>
              <p className="font-medium text-error">Delete Account</p>
              <p className="text-sm text-muted">Permanently delete your account and all data.</p>
            </div>
            <Button variant="danger" onClick={() => { /* TODO */ }}>
              Delete Account
            </Button>
          </div>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-semibold text-primary">Session</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Button variant="outline" fullWidth onClick={handleLogout}>
            Log Out
          </Button>
        </CardBody>
      </Card>

      <div className="mt-6 text-center text-sm text-muted">
        <p>JALRAKSHAK v1.0.0 · Part of KRISHISETU platform</p>
      </div>
    </div>
  );
}

export default SettingsPage;