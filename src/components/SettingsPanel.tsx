import React, { useState } from 'react';
import { Save, Plus, X, Globe, Lock, Shield, Info, Image as ImageIcon } from 'lucide-react';

interface SettingsPanelProps {
  schema: any;
  onUpdateSchema: (updatedSchema: any) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ schema, onUpdateSchema }) => {
  const [newPermission, setNewPermission] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    let updatedSchema = {
      ...schema,
      [field]: value
    };

    // Auto-generate slug when name changes
    if (field === 'name' && typeof value === 'string') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      updatedSchema = {
        ...updatedSchema,
        slug
      };
    }

    onUpdateSchema(updatedSchema);
  };

  const addPermission = () => {
    const currentPermissions = schema.permissions || [];
    if (newPermission.trim() && !currentPermissions.includes(newPermission.trim())) {
      const updatedSchema = {
        ...schema,
        permissions: [...currentPermissions, newPermission.trim()]
      };
      onUpdateSchema(updatedSchema);
      setNewPermission('');
    }
  };

  const removePermission = (permission: string) => {
    const currentPermissions = schema.permissions || [];
    const updatedSchema = {
      ...schema,
      permissions: currentPermissions.filter((p: string) => p !== permission)
    };
    onUpdateSchema(updatedSchema);
  };

  const addStatus = () => {
    const currentStatuses = schema.statuses || [];
    if (newStatus.trim() && !currentStatuses.includes(newStatus.trim())) {
      const updatedSchema = {
        ...schema,
        statuses: [...currentStatuses, newStatus.trim()]
      };
      onUpdateSchema(updatedSchema);
      setNewStatus('');
    }
  };

  const removeStatus = (status: string) => {
    const currentStatuses = schema.statuses || [];
    const updatedSchema = {
      ...schema,
      statuses: currentStatuses.filter((s: string) => s !== status)
    };
    onUpdateSchema(updatedSchema);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="space-y-4">
        <SectionHeader title="General Information" icon={<Info size={14} />} />

        <div className="space-y-4 px-1">
          <InputGroup label="Application ID" description="Unique identifier for the app.">
            <input
              type="text"
              value={schema.id || ''}
              onChange={(e) => handleInputChange('id', e.target.value)}
              className="styled-input"
              placeholder="e.g. sample-builder-app"
            />
          </InputGroup>

          <InputGroup label="Display Name">
            <input
              type="text"
              value={schema.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="styled-input"
              placeholder="e.g. My Awesome App"
            />
          </InputGroup>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup label="Version">
              <input
                type="text"
                value={schema.version || ''}
                onChange={(e) => handleInputChange('version', e.target.value)}
                className="styled-input"
                placeholder="1.0.0"
              />
            </InputGroup>
            <InputGroup label="URL Slug">
              <input
                type="text"
                value={schema.slug || ''}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="styled-input"
                placeholder="my-awesome-app"
              />
            </InputGroup>
          </div>

          <InputGroup label="App Icon URL" description="Direct URL to your application icon image.">
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={schema.icon || ''}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  className="styled-input"
                  placeholder="https://example.com/icon.png"
                />
              </div>
              <div className="w-12 h-12 rounded-xl border border-border/60 bg-muted/30 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {schema.icon ? (
                  <img
                    src={schema.icon}
                    alt="App Icon Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48?text=Error';
                    }}
                  />
                ) : (
                  <ImageIcon size={20} className="text-muted-foreground/40" />
                )}
              </div>
            </div>
          </InputGroup>

          <InputGroup label="Description">
            <textarea
              value={schema.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="styled-input min-h-[80px]"
              rows={3}
              placeholder="Tell us what this app does..."
            />
          </InputGroup>
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
              {(schema.permissions || []).map((permission: string, index: number) => (
                <Tag key={index} label={permission} onRemove={() => removePermission(permission)} color="primary" />
              ))}
              {(!schema.permissions || schema.permissions.length === 0) && <p className="text-[11px] text-muted-foreground italic px-1">No permissions defined yet.</p>}
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
              {(schema.statuses || []).map((status: string, index: number) => (
                <Tag key={index} label={status} onRemove={() => removeStatus(status)} color="accent" />
              ))}
              {(!schema.statuses || schema.statuses.length === 0) && <p className="text-[11px] text-muted-foreground italic px-1">No statuses defined yet.</p>}
            </div>
          </div>
        </div>
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