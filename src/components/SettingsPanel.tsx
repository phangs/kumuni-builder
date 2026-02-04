import React, { useState } from 'react';
import { Save, Plus, X, Globe, Lock, Shield, Info } from 'lucide-react';

interface SettingsPanelProps {
  schema: any;
  onUpdateSchema: (updatedSchema: any) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ schema, onUpdateSchema }) => {
  const [settings, setSettings] = useState({
    id: schema.id || 'builder-app',
    name: schema.name || '',
    version: schema.version || '1.0.0',
    description: schema.description || '',
    slug: schema.slug || '',
    isPublic: schema.is_public || false,
    permissions: schema.permissions ? [...schema.permissions] : [],
    statuses: schema.statuses ? [...schema.statuses] : [],
  });

  const [newPermission, setNewPermission] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const updatedSchema = {
      ...schema,
      id: settings.id,
      name: settings.name,
      version: settings.version,
      description: settings.description,
      slug: settings.slug,
      is_public: settings.isPublic,
      permissions: settings.permissions,
      statuses: settings.statuses,
    };
    onUpdateSchema(updatedSchema);
  };

  const addPermission = () => {
    if (newPermission.trim() && !settings.permissions.includes(newPermission.trim())) {
      setSettings(prev => ({
        ...prev,
        permissions: [...prev.permissions, newPermission.trim()]
      }));
      setNewPermission('');
    }
  };

  const removePermission = (permission: string) => {
    setSettings(prev => ({
      ...prev,
      permissions: prev.permissions.filter(p => p !== permission)
    }));
  };

  const addStatus = () => {
    if (newStatus.trim() && !settings.statuses.includes(newStatus.trim())) {
      setSettings(prev => ({
        ...prev,
        statuses: [...prev.statuses, newStatus.trim()]
      }));
      setNewStatus('');
    }
  };

  const removeStatus = (status: string) => {
    setSettings(prev => ({
      ...prev,
      statuses: prev.statuses.filter(s => s !== status)
    }));
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-4">
        <SectionHeader title="General Information" icon={<Info size={14} />} />

        <div className="space-y-4 px-1">
          <InputGroup label="Application ID" description="Unique identifier for the app.">
            <input
              type="text"
              value={settings.id}
              onChange={(e) => handleInputChange('id', e.target.value)}
              className="styled-input"
              placeholder="e.g. sample-builder-app"
            />
          </InputGroup>

          <InputGroup label="Display Name">
            <input
              type="text"
              value={settings.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="styled-input"
              placeholder="e.g. My Awesome App"
            />
          </InputGroup>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Version">
              <input
                type="text"
                value={settings.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                className="styled-input"
                placeholder="1.0.0"
              />
            </InputGroup>
            <InputGroup label="URL Slug">
              <input
                type="text"
                value={settings.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="styled-input"
                placeholder="my-awesome-app"
              />
            </InputGroup>
          </div>

          <InputGroup label="Description">
            <textarea
              value={settings.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="styled-input min-h-[80px]"
              rows={3}
              placeholder="Tell us what this app does..."
            />
          </InputGroup>

          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border/40 group cursor-pointer" onClick={() => handleInputChange('isPublic', !settings.isPublic)}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${settings.isPublic ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
              {settings.isPublic ? <Globe size={18} /> : <Lock size={18} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Public Availability</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Whether this application is visible to all users.</p>
            </div>
            <div className={`w-11 h-6 rounded-full relative transition-colors ${settings.isPublic ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeader title="Permissions & Access" icon={<Shield size={14} />} />

        <div className="space-y-6 px-1">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Required Permissions</label>
            </div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newPermission}
                onChange={(e) => setNewPermission(e.target.value)}
                className="styled-input flex-1"
                placeholder="e.g. camera, storage"
              />
              <button
                onClick={addPermission}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.permissions.map((permission, index) => (
                <Tag key={index} label={permission} onRemove={() => removePermission(permission)} color="primary" />
              ))}
              {settings.permissions.length === 0 && <p className="text-[11px] text-muted-foreground italic px-1">No permissions defined yet.</p>}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Available Statuses</label>
            </div>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="styled-input flex-1"
                placeholder="e.g. active, pending"
              />
              <button
                onClick={addStatus}
                className="w-10 h-10 bg-accent text-accent-foreground rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.statuses.map((status, index) => (
                <Tag key={index} label={status} onRemove={() => removeStatus(status)} color="accent" />
              ))}
              {settings.statuses.length === 0 && <p className="text-[11px] text-muted-foreground italic px-1">No statuses defined yet.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 px-1">
        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm leading-none"
        >
          <Save size={16} />
          Save Application Settings
        </button>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, icon }: { title: string, icon: any }) => (
  <div className="flex items-center gap-2 border-b border-border/40 pb-2 mb-4">
    <div className="text-primary">{icon}</div>
    <h3 className="text-xs font-bold text-foreground uppercase tracking-widest leading-none">{title}</h3>
  </div>
);

const InputGroup = ({ label, description, children }: { label: string, description?: string, children: any }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-foreground/60 uppercase tracking-widest px-1">{label}</label>
    {children}
    {description && <p className="text-[10px] text-muted-foreground px-1 opacity-70 leading-tight">{description}</p>}
  </div>
);

const Tag = ({ label, onRemove, color }: { label: string, onRemove: () => void, color: 'primary' | 'accent' }) => (
  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${color === 'primary'
    ? 'bg-primary/10 text-primary border-primary/20'
    : 'bg-accent/10 text-accent-foreground border-accent/20'
    }`}>
    {label}
    <button onClick={onRemove} className="hover:opacity-70 transition-opacity"><X size={12} /></button>
  </div>
);