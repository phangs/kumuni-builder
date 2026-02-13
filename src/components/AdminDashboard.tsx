import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { Eye, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { apiGet } from '../utils/api';

interface MiniappSubmission {
    id: string;
    name: string;
    description: string;
    developer: string;
    developerEmail: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    category: string;
    iconUrl?: string;
}

interface DeveloperPendingResponse {
    id: string;
    email: string;
    fullName: string;
    company: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    miniapps?: Array<{
        id: string;
        name: string;
        description: string;
        iconUrl: string;
        category: string;
        provider: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    }>;
}

const API_BASE_URL = import.meta.env.VITE_BUILDER_API_BASE_URL;

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [submissions, setSubmissions] = useState<MiniappSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMiniappReviews();
    }, []);

    const fetchMiniappReviews = async () => {
        setIsLoading(true);

        try {
            const response = await apiGet(`${API_BASE_URL}/admin/miniapps/reviews`);

            if (!response.ok) {
                throw new Error('Failed to fetch miniapp reviews');
            }

            const result = await response.json();

            if (result.success && result.data) {
                // Transform the API response into our submission format
                const transformedSubmissions: MiniappSubmission[] = result.data.map((miniapp: any) => ({
                    id: miniapp.id,
                    name: miniapp.name,
                    description: miniapp.description || 'No description provided',
                    developer: miniapp.developer?.fullName || miniapp.developer?.email || 'Unknown Developer',
                    developerEmail: miniapp.developer?.email || '',
                    submittedAt: miniapp.createdAt || miniapp.submittedAt || new Date().toISOString(),
                    status: miniapp.status === 'pending_review' ? 'pending' :
                        miniapp.status === 'approved' ? 'approved' :
                            miniapp.status === 'rejected' ? 'rejected' : 'pending',
                    category: miniapp.category || 'Uncategorized',
                    iconUrl: miniapp.iconUrl
                }));

                setSubmissions(transformedSubmissions);
            }
        } catch (error) {
            console.error('Error fetching miniapp reviews:', error);
            toast.error('Failed to load submissions');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredSubmissions = filter === 'all'
        ? submissions
        : submissions.filter(sub => sub.status === filter);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                        <Clock size={12} />
                        Pending Review
                    </span>
                );
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 border border-green-500/20">
                        <CheckCircle size={12} />
                        Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
                        <XCircle size={12} />
                        Rejected
                    </span>
                );
            default:
                return null;
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

    const getStatusCount = (status: 'pending' | 'approved' | 'rejected') => {
        return submissions.filter(sub => sub.status === status).length;
    };

    return (
        <div className="dark min-h-screen bg-background text-foreground">
            <MainLayout showBuilderButtons={false}>
                <div className="flex-1 overflow-auto p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Admin Dashboard</h1>
                            <span className="text-xs font-bold text-primary uppercase tracking-widest px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                                Administrator
                            </span>
                        </div>
                        <p className="text-muted-foreground text-sm">Review and manage miniapp submissions</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total</span>
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Eye size={18} className="text-primary" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground">{submissions.length}</p>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-6 hover:border-yellow-500/40 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pending</span>
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                    <Clock size={18} className="text-yellow-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground">{getStatusCount('pending')}</p>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-6 hover:border-green-500/40 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Approved</span>
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle size={18} className="text-green-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground">{getStatusCount('approved')}</p>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-6 hover:border-red-500/40 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rejected</span>
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                    <XCircle size={18} className="text-red-600" />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground">{getStatusCount('rejected')}</p>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === 'all'
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-border'
                                }`}
                        >
                            All Submissions
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === 'pending'
                                ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-border'
                                }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === 'approved'
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-border'
                                }`}
                        >
                            Approved
                        </button>
                        <button
                            onClick={() => setFilter('rejected')}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === 'rejected'
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-border'
                                }`}
                        >
                            Rejected
                        </button>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="bg-card border border-border rounded-2xl p-12 text-center">
                            <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
                            <p className="text-muted-foreground">Loading submissions...</p>
                        </div>
                    ) : (
                        /* Submissions Table */
                        <div className="bg-card border border-border rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/20 border-b border-border">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                Miniapp Name
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                Developer
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                Category
                                            </th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                Submitted
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
                                        {filteredSubmissions.map((submission) => (
                                            <tr
                                                key={submission.id}
                                                className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                                                onClick={() => navigate(`/admin/review/${submission.id}`)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-foreground">{submission.name}</p>
                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                                            {submission.description}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm text-foreground">{submission.developer}</p>
                                                        <p className="text-xs text-muted-foreground">{submission.developerEmail}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-medium px-2.5 py-1 bg-muted/40 text-foreground rounded-lg">
                                                        {submission.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    {formatDate(submission.submittedAt)}
                                                </td>
                                                <td className="px-6 py-4">{getStatusBadge(submission.status)}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/admin/review/${submission.id}`);
                                                        }}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-all border border-primary/20"
                                                    >
                                                        <Eye size={14} />
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredSubmissions.length === 0 && !isLoading && (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No submissions found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </MainLayout>
        </div>
    );
};
