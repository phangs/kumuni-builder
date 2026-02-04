import React, { useState } from 'react';
import { MainLayout } from './MainLayout';

export const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });
  const [language, setLanguage] = useState('en');

  const handleNotificationChange = (type: string) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof notifications]
    }));
  };

  return (
    <MainLayout>
      <div className="h-full overflow-y-auto custom-scrollbar px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Settings</h2>
              <p className="mt-1 text-sm text-gray-500">
                Configure your account preferences and application settings.
              </p>
            </div>

            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-8 divide-y divide-gray-200">
                {/* Appearance Settings */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Customize the look and feel of the application.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">Dark Mode</div>
                        <div className="ml-2 text-sm text-gray-500" id="dark-mode-description">
                          Toggle dark mode on/off
                        </div>
                      </div>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        type="button"
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${darkMode ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        role="switch"
                        aria-checked={darkMode}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${darkMode ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="pt-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose how you receive notifications.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">Email</div>
                        <div className="ml-2 text-sm text-gray-500" id="email-notifications-description">
                          Receive notifications via email
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('email')}
                        type="button"
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        role="switch"
                        aria-checked={notifications.email}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${notifications.email ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">Push Notifications</div>
                        <div className="ml-2 text-sm text-gray-500" id="push-notifications-description">
                          Receive push notifications on your devices
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('push')}
                        type="button"
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        role="switch"
                        aria-checked={notifications.push}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${notifications.push ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">SMS</div>
                        <div className="ml-2 text-sm text-gray-500" id="sms-notifications-description">
                          Receive notifications via SMS
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationChange('sms')}
                        type="button"
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        role="switch"
                        aria-checked={notifications.sms}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${notifications.sms ? 'translate-x-5' : 'translate-x-0'
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Language Settings */}
                <div className="pt-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Language</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select your preferred language for the application.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                    <div className="sm:col-span-3">
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                        Language
                      </label>
                      <div className="mt-1">
                        <select
                          id="language"
                          name="language"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};