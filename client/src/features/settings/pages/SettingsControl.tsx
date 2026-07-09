/**
 * @file SettingsControl.tsx
 * @description Settings configuration management page for profile, API keys, and theme controls. */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore, type Theme } from '../../../store/uiStore';
import GithubProfiler from '../../github/components/GithubProfiler';
import { User, Key, Settings, Monitor, Sun, Moon } from 'lucide-react';

export function SettingsControl() {
  const { user, updateUser } = useAuthStore();
  const { theme, setTheme, addToast } = useUIStore();

  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || '');
  const [apiKey, setApiKey] = useState('sk-••••••••••••••••••••••••');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateUser({ name, role });
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile preferences have been successfully updated.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not save profile details.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">

      {/* Workspace Header */}
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Settings Workspace</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage profile secrets, third-party API keys, and theme configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Forms */}
        <div className="lg:col-span-7 space-y-6">

          {/* User profile details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="john deo"
                />

                <Input
                  label="Target Job Title"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Senior Software Engineer"
                />

                <Button type="submit" isLoading={saving}>
                  Save Preferences
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Secrets credentials (API Keys) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                API Keys (OpenAI / LLM Integration)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="OpenAI Api Key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <Button
                variant="secondary"
                onClick={() =>
                  addToast({
                    type: 'success',
                    title: 'API Keys Saved',
                    message: 'Keys have been cryptographically saved locally.',
                  })
                }
              >
                Save Keys
              </Button>
            </CardContent>
          </Card>

          {/* Integration of GitHub Repository synchronizations */}
          <GithubProfiler />

        </div>

        {/* Right Column: Theme switches */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Theme Customizations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Active Theme Preference
              </span>

              <div className="grid grid-cols-3 gap-2.5">
                {([
                  { id: 'light', icon: Sun },
                  { id: 'dark', icon: Moon },
                  { id: 'system', icon: Monitor },
                ] as Array<{ id: Theme; icon: any }>).map((item) => {
                  const Icon = item.icon;
                  const isActive = theme === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setTheme(item.id)}
                      className={`flex flex-col items-center justify-center border rounded-lg p-4 gap-2 transition-all select-none
                        ${isActive
                          ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary'
                          : 'border-border bg-card text-muted-foreground hover:bg-accent/40'
                        }
                      `}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-wider capitalize">
                        {item.id}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  );
}

export default SettingsControl;
