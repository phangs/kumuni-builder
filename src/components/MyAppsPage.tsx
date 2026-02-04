import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { Plus, Search, Filter, LayoutGrid, Calendar, Clock, Edit3, Eye, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface AppItem {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  lastEdited: string;
}

export const MyAppsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [filteredApps, setFilteredApps] = useState<AppItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockApps: AppItem[] = [
      {
        id: '1',
        name: 'E-commerce App',
        description: 'A full-featured e-commerce application',
        status: 'published',
        createdAt: '2023-01-15',
        updatedAt: '2023-05-20',
        lastEdited: '2023-05-20'
      },
      {
        id: '2',
        name: 'Task Manager',
        description: 'Simple task management application',
        status: 'draft',
        createdAt: '2023-02-10',
        updatedAt: '2023-03-12',
        lastEdited: '2023-03-12'
      },
      {
        id: '3',
        name: 'Blog Platform',
        description: 'Content management system for blogs',
        status: 'published',
        createdAt: '2023-01-22',
        updatedAt: '2023-06-18',
        lastEdited: '2023-06-18'
      },
      {
        id: '4',
        name: 'Fitness Tracker',
        description: 'Track workouts and nutrition',
        status: 'draft',
        createdAt: '2023-03-05',
        updatedAt: '2023-04-10',
        lastEdited: '2023-04-10'
      },
      {
        id: '5',
        name: 'Social Media Dashboard',
        description: 'Manage multiple social media accounts',
        status: 'published',
        createdAt: '2023-02-28',
        updatedAt: '2023-07-01',
        lastEdited: '2023-07-01'
      }
    ];

    setApps(mockApps);
    setFilteredApps(mockApps);
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
                onClick={() => navigate('/builder')}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm leading-none"
              >
                <Plus size={18} strokeWidth={3} />
                Create New App
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

          {filteredApps.length === 0 ? (
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
                onClick={() => navigate('/builder')}
                className="px-6 py-2.5 bg-muted text-foreground hover:bg-muted/80 rounded-xl text-sm font-bold transition-all border border-border"
              >
                Get Started Now
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
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted/50 text-muted-foreground transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                        <LayoutGrid size={24} />
                      </div>
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
                        onClick={() => navigate('/builder')}
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