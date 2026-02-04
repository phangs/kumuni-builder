import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfileMenu } from './UserProfileMenu';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
  showBuilderButtons?: boolean;
  onImportClick?: () => void;
  onSaveClick?: () => void;
  onPreviewClick?: () => void;
  onExportClick?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showBuilderButtons = false,
  onImportClick,
  onSaveClick,
  onPreviewClick,
  onExportClick
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dark h-screen flex flex-col bg-background text-foreground overflow-hidden selection:bg-primary/20 selection:text-primary">
      {/* Top toolbar */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border/50 px-6 py-3 flex justify-between items-center z-50 shadow-sm relative">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-black text-lg">K</span>
          </div>
          <h1
            className="text-lg font-bold tracking-tight text-foreground cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/my-apps')}
          >
            Kumuni <span className="text-primary">Builder</span>
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          {showBuilderButtons && (
            <div className="flex items-center bg-muted/30 p-1 rounded-xl border border-border/40">
              <button
                className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all rounded-lg"
                onClick={onImportClick}
              >
                Import
              </button>
              <div className="w-px h-4 bg-border/40 mx-1" />
              <button
                className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all rounded-lg"
                onClick={onExportClick}
              >
                Export
              </button>
              <div className="w-px h-4 bg-border/40 mx-1" />
              <button
                className="mx-2 px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all rounded-lg"
                onClick={onSaveClick}
              >
                Save
              </button>
              <button
                className="px-4 py-1.5 text-xs font-bold border border-primary/20 text-primary hover:bg-primary/5 transition-all rounded-lg"
                onClick={onPreviewClick}
              >
                Preview
              </button>
            </div>
          )}
          <UserProfileMenu user={user} />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};