import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { UserCheck, UserX, Clock, Loader2, Mail, Building2, Calendar } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface Developer {
    id: string;
    email: string;
    fullName: string;
    company: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_BUILDER_API_BASE_URL;

export const DevelopersPage: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPendingDevelopers();
    }, []);

    const fetchPendingDevelopers = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('kumuni-token');

        if (!token) {
            toast.error('Authentication required');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/admin/developers/pending`, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch pending developers');
            }

            const result = await response.json();

            if (result.success && result.data) {
                setDevelopers(result.data);
            }
        } catch (error) {
            console.error('Error fetching pending developers:', error);
            toast.error('Failed to load developers');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (developerId: string, developerName: string) => {
        const token = localStorage.getItem('kumuni-token');

        if (!token) {
            toast.error('Authentication required');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/admin/developers/${developerId}/approve`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to approve developer');
            }

            toast.success(`${developerName} has been approved!`);
            // Refresh the list
            fetchPendingDevelopers();
        } catch (error) {
            console.error('Error approving developer:', error);
            toast.error('Failed to approve developer');
        }
    };

    const handleReject = async (developerId: string, developerName: string) => {
        const token = localStorage.getItem('kumuni-token');

        if (!token) {
            toast.error('Authentication required');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/admin/developers/${developerId}/reject`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to reject developer');
            }

            toast.success(`${developerName} has been rejected`);
            // Refresh the list
            fetchPendingDevelopers();
        } catch (error) {
            console.error('Error rejecting developer:', error);
            toast.error('Failed to reject developer');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dark min-h-screen bg-background text-foreground">
            <MainLayout showBuilderButtons={false}>
                <div className="flex-1 overflow-auto p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Developer Registrations</h1>
                            <span className="text-xs font-bold text-primary uppercase tracking-widest px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                                Administrator
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm">Review and approve developer account registrations</p>
                    </div>

                    {/* Stats Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pending Approval</span>
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                    <Clock size={18} className="text-yellow-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground">{developers.length}</p>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-6 hover:border-green-500/40 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Developers</span>
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <UserCheck size={18} className="text-primary" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground">-</p>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-6 hover:border-red-500/40 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rejected</span>
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                    <UserX size={18} className="text-red-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground">-</p>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="bg-card border border-border rounded-2xl p-12 text-center">
                            <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading developer registrations...</p>
                        </div>
                    ) : (
                        /* Developers Table */
                        <div className="bg-card border border-border rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/20 border-b border-border">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                Developer
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                Company
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                Registered
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                Status
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {developers.map((developer) => (
                                            <tr
                                                key={developer.id}
                                                className="border-b border-border hover:bg-muted/20 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20">
                                                            {developer.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-foreground">{developer.fullName}</p>
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                                <Mail size={12} />
                                                                {developer.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-foreground">
                                                        <Building2 size={14} className="text-muted-foreground" />
                                                        {developer.company}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar size={14} />
                                                        {formatDate(developer.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                                                        <Clock size={12} />
                                                        {developer.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleApprove(developer.id, developer.fullName)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-xl text-sm font-semibold hover:bg-green-500/20 transition-all border border-green-500/20"
                                                        >
                                                            <UserCheck size={14} />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(developer.id, developer.fullName)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-all border border-red-500/20"
                                                        >
                                                            <UserX size={14} />
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {developers.length === 0 && !isLoading && (
                                <div className="text-center py-12">
                                    <UserCheck size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                                    <p className="text-muted-foreground font-semibold mb-1">No pending registrations</p>
                                    <p className="text-sm text-muted-foreground/60">All developer registrations have been processed</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </MainLayout>
        </div>
    );
};
