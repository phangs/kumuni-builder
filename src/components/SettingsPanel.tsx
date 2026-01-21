import React, { useState } from 'react';

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
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">App Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">App ID</label>
          <input
            type="text"
            value={settings.id}
            onChange={(e) => handleInputChange('id', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="Enter app ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="Enter app name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
          <input
            type="text"
            value={settings.version}
            onChange={(e) => handleInputChange('version', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., 1.0.0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={settings.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            rows={2}
            placeholder="Enter app description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input
            type="text"
            value={settings.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="Enter app slug"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={settings.isPublic}
            onChange={(e) => handleInputChange('isPublic', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
            Public App
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newPermission}
              onChange={(e) => setNewPermission(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l text-sm"
              placeholder="Add new permission"
            />
            <button
              onClick={addPermission}
              className="px-3 py-2 bg-blue-500 text-white rounded-r text-sm hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.permissions.map((permission, index) => (
              <div 
                key={index} 
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
              >
                {permission}
                <button
                  onClick={() => removePermission(permission)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statuses</label>
          <div className="flex mb-2">
            <input
              type="text"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l text-sm"
              placeholder="Add new status"
            />
            <button
              onClick={addStatus}
              className="px-3 py-2 bg-green-500 text-white rounded-r text-sm hover:bg-green-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.statuses.map((status, index) => (
              <div 
                key={index} 
                className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
              >
                {status}
                <button
                  onClick={() => removeStatus(status)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};