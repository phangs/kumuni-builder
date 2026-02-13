import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { Plus, Search, Filter, LayoutGrid, Calendar, Clock, Edit3, Eye, MoreVertical, Trash2, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface AppItem {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  lastEdited: string;
  iconUrl?: string;
}

export const MyAppsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [filteredApps, setFilteredApps] = useState<AppItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMenuAppId, setActiveMenuAppId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<AppItem | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCreateApp = async () => {
    const token = localStorage.getItem('kumuni-token');
    if (!token) return;

    setIsCreating(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BUILDER_API_BASE_URL}/builder/miniapps`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "Untitled App",
          description: "Blank app template",
          iconUrl: "",
          category: "default",
          provider: "system",
          sduiSchema: {
            id: "untitled-app",
            version: "1.0",
            name: "Untitled App",
            description: "SDUI Builder Application",
            slug: "untitled-app",
            icon: "",
            is_public: false,
            is_published: false,
            published_at: null,
            navigation: {
              initialPageId: "welcome"
            },
            pages: [
              {
                id: "welcome",
                order: 0,
                "title": "Welcome",
                components: []
              }
            ],
            metadata: {
              revision: 1,
              createdBy: user?.id || "builder"
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Handle wrapped response structure: { success: true, data: { ... } }
        const newApp = result.success && result.data ? result.data : result;

        if (newApp && newApp.id) {
          navigate(`/builder/${newApp.id}`);
        } else {
          // Fallback to pure builder if no ID returned (shouldn't happen with correct API)
          navigate('/builder');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to create app: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating app:', error);
      alert('An error occurred while creating the application.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmitForReview = async (appId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm('Are you sure you want to submit this app for review?')) return;

    const token = localStorage.getItem('kumuni-token');
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BUILDER_API_BASE_URL}/builder/miniapps/${appId}/submit`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('App submitted for review successfully!');
        // Refresh apps
        fetchApps();
        setActiveMenuAppId(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to submit: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting app:', error);
      alert('An error occurred while submitting.');
    }
  };

  const openDeleteModal = (app: AppItem, event: React.MouseEvent) => {
    event.stopPropagation();
    setAppToDelete(app);
    setDeleteConfirmText('');
    setDeleteModalOpen(true);
    setActiveMenuAppId(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setAppToDelete(null);
    setDeleteConfirmText('');
  };

  const handleDeleteApp = async () => {
    if (!appToDelete || deleteConfirmText !== appToDelete.name) return;

    const token = localStorage.getItem('kumuni-token');
    if (!token) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BUILDER_API_BASE_URL}/builder/miniapps/${appToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setApps(prev => prev.filter(app => app.id !== appToDelete.id));
        closeDeleteModal();
        alert('App deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to delete: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting app:', error);
      alert('An error occurred while deleting.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch mini-apps from the backend API
  const fetchApps = async () => {
    const token = localStorage.getItem('kumuni-token');
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BUILDER_API_BASE_URL}/builder/miniapps`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        // Handle wrapped response structure: { success: true, data: [...] }
        const appsList = result.success && Array.isArray(result.data)
          ? result.data
          : (Array.isArray(result) ? result : []);

        const mappedApps: AppItem[] = appsList.map((app: any) => ({
          id: app.id,
          name: app.name,
          description: app.description || '',
          iconUrl: app.iconUrl,
          status: app.status === 'published' ? 'published' : 'draft',
          createdAt: app.created_at || app.createdAt || new Date().toISOString(),
          updatedAt: app.updated_at || app.updatedAt || new Date().toISOString(),
          lastEdited: app.updated_at || app.updatedAt || new Date().toISOString(),
        }));

        setApps(mappedApps);
        setFilteredApps(mappedApps);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.message || 'Failed to fetch applications';
        setError(errorMsg);
        console.error('Failed to fetch apps:', errorMsg);
      }
    } catch (error) {
      setError('An error occurred while connecting to the server');
      console.error('Error fetching apps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // Filter apps based on status and search term
  useEffect(() => {
    let result = apps;

    if (filter !== 'all') {
      result = result.filter(app => app.status === filter);
    }

    if (searchTerm) {
      result = result.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApps(result);
  }, [filter, searchTerm, apps]);

  const getStatusBadge = (status: string) => {
    if (status === 'published') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
          PUBLISHED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
        <div className="w-1 h-1 bg-amber-500 rounded-full" />
        DRAFT
      </span>
    );
  };

  return (
    <MainLayout>
      <div className="h-full overflow-y-auto custom-scrollbar px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <LayoutGrid className="text-primary" size={24} />
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Applications</h1>
                </div>
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                  Management hub for your cross-platform SDUI microapps. Build, iterate, and deploy with real-time syncing.
                </p>
              </div>
              <button
                onClick={handleCreateApp}
                disabled={isCreating}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm leading-none disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Plus size={18} strokeWidth={3} className={isCreating ? "animate-spin" : ""} />
                {isCreating ? 'Creating...' : 'Create New App'}
              </button>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-xl border border-border/40 rounded-[2rem] p-4 mb-10 shadow-2xl shadow-black/20 animate-in fade-in delay-200 duration-700">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search through applications..."
                  className="w-full bg-muted/30 border border-border/40 hover:border-border/80 focus:border-primary rounded-2xl pl-12 pr-4 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-primary/5 placeholder:text-muted-foreground/40"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex bg-muted/30 p-1.5 rounded-2xl border border-border/40">
                <FilterTab active={filter === 'all'} label="All" count={apps.length} onClick={() => setFilter('all')} />
                <FilterTab
                  active={filter === 'published'}
                  label="Published"
                  count={apps.filter(a => a.status === 'published').length}
                  onClick={() => setFilter('published')}
                />
                <FilterTab
                  active={filter === 'draft'}
                  label="Drafts"
                  count={apps.filter(a => a.status === 'draft').length}
                  onClick={() => setFilter('draft')}
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card/50 border border-border/40 rounded-[2rem] p-6 h-64 animate-pulse flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-muted rounded-2xl" />
                    <div className="h-6 bg-muted rounded-lg w-3/4" />
                    <div className="h-4 bg-muted rounded-lg w-full" />
                    <div className="h-4 bg-muted rounded-lg w-5/6" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="h-4 bg-muted rounded-lg w-1/4" />
                    <div className="flex gap-2">
                      <div className="w-10 h-10 bg-muted rounded-xl" />
                      <div className="w-10 h-10 bg-muted rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-card/40 rounded-[3rem] border border-dashed border-destructive/30 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mb-6 text-destructive">
                <MoreVertical className="rotate-90" size={40} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Sync Error</h3>
              <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                {error}
              </p>
              <button
                onClick={() => fetchApps()}
                className="px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20"
              >
                Retry Synchronization
              </button>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-card/40 rounded-[3rem] border border-dashed border-border/60 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center mb-6 text-muted-foreground/40">
                <LayoutGrid size={40} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                {filter === 'all'
                  ? "You haven't created any applications yet. Start your journey by creating your first microapp!"
                  : `We couldn't find any ${filter} applications matching your criteria.`}
              </p>
              <button
                onClick={handleCreateApp}
                disabled={isCreating}
                className="px-6 py-2.5 bg-muted text-foreground hover:bg-muted/80 rounded-xl text-sm font-bold transition-all border border-border disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Get Started Now'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredApps.map((app, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  key={app.id}
                  className="group bg-card hover:bg-card/80 border border-border/40 hover:border-primary/30 rounded-[2rem] p-6 transition-all duration-300 shadow-lg shadow-black/5 hover:shadow-primary/5 relative overflow-hidden flex flex-col h-full"
                >
                  <div className={`absolute top-0 right-0 p-4 transition-opacity z-20 ${activeMenuAppId === app.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuAppId(activeMenuAppId === app.id ? null : app.id);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted/50 text-muted-foreground transition-colors bg-card/80 backdrop-blur-sm shadow-sm"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenuAppId === app.id && (
                        <div className="absolute right-0 top-full mt-2 w-32 bg-card border border-border/60 rounded-xl shadow-xl overflow-hidden py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                          <button
                            onClick={(e) => handleSubmitForReview(app.id, e)}
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/50 flex items-center gap-2 transition-colors border-b border-border/40"
                          >
                            <Send size={14} />
                            Submit for Review
                          </button>
                          <button
                            onClick={(e) => openDeleteModal(app, e)}
                            className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                      {app.iconUrl ? (
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-border/40 group-hover:scale-110 transition-transform duration-500 bg-white">
                          <img
                            src={app.iconUrl}
                            alt={app.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).parentElement?.classList.add('hidden');
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                          <LayoutGrid size={24} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{app.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">{app.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-auto">
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                        <Calendar size={10} />
                        Created {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                        <Clock size={10} />
                        Updated {new Date(app.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/builder/${app.id}`)}
                        className="w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center text-primary-foreground hover:scale-110 active:scale-95 transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button className="w-10 h-10 rounded-xl bg-muted border border-border/60 flex items-center justify-center text-foreground hover:bg-muted/80 transition-all">
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && appToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={closeDeleteModal}
          />
          <div className="relative bg-card border border-border rounded-[2rem] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive mb-4">
                <Trash2 size={32} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Intentional Check</h2>
              <p className="text-muted-foreground mt-2">
                This action cannot be undone. To delete <strong>{appToDelete.name}</strong>, please type the app name below.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Type application name..."
                autoFocus
                className="w-full bg-muted/30 border border-border hover:border-border/80 focus:border-destructive rounded-2xl px-6 py-4 text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-destructive/5 placeholder:text-muted-foreground/30"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold bg-muted hover:bg-muted/80 transition-all text-sm leading-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteApp}
                  disabled={deleteConfirmText !== appToDelete.name || isDeleting}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold bg-destructive text-white shadow-xl shadow-destructive/20 hover:shadow-destructive/30 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm leading-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

const FilterTab = ({ active, label, count, onClick }: { active: boolean, label: string, count: number, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${active
      ? 'bg-card text-foreground shadow-sm shadow-black/10'
      : 'text-muted-foreground hover:text-foreground'
      }`}
  >
    {label}
    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${active ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/10 text-muted-foreground/60'}`}>
      {count}
    </span>
  </button>
);