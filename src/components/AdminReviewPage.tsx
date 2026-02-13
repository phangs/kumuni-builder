import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from './MainLayout';
import { SduiPage } from './SduiRenderer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { ArrowLeft, CheckCircle, XCircle, Code, Eye } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

// Mock miniapp schema data
const mockMiniappSchemas: Record<string, any> = {
    '1': {
        id: 'family-member-manager',
        version: '1.0',
        name: 'Family Member Manager',
        description: 'A comprehensive app for managing family member information and relationships',
        slug: 'family-member-manager',
        icon: '',
        is_public: false,
        is_published: false,
        published_at: null,
        navigation: {
            initialPageId: 'home'
        },
        pages: [
            {
                id: 'home',
                order: 0,
                title: 'Family Members',
                components: [
                    {
                        id: 'header',
                        type: 'heading',
                        props: {
                            text: 'Family Member Manager',
                            style: {}
                        },
                        gridRow: 0,
                        rowSpan: 1
                    },
                    {
                        id: 'description',
                        type: 'text',
                        props: {
                            text: 'Manage your family member information and relationships',
                            style: { color: '#6B7280' }
                        },
                        gridRow: 1,
                        rowSpan: 1
                    },
                    {
                        id: 'name-input',
                        type: 'text-input',
                        props: {
                            label: 'Full Name',
                            placeholder: 'Enter full name'
                        },
                        gridRow: 2,
                        rowSpan: 1
                    },
                    {
                        id: 'relationship-select',
                        type: 'select',
                        props: {
                            label: 'Relationship',
                            placeholder: 'Select relationship',
                            options: [
                                { label: 'Spouse', value: 'spouse' },
                                { label: 'Child', value: 'child' },
                                { label: 'Parent', value: 'parent' },
                                { label: 'Sibling', value: 'sibling' }
                            ]
                        },
                        gridRow: 3,
                        rowSpan: 1
                    },
                    {
                        id: 'submit-btn',
                        type: 'button',
                        props: {
                            title: 'Add Family Member',
                            variant: 'primary'
                        },
                        gridRow: 4,
                        rowSpan: 1
                    }
                ]
            }
        ],
        metadata: {
            revision: 1,
            createdBy: 'john-doe'
        },
        created_at: '2026-02-13T10:30:00Z',
        updated_at: '2026-02-13T10:30:00Z'
    },
    '2': {
        id: 'point-of-sale',
        version: '1.0',
        name: 'Point of Sale',
        description: 'Modern POS system for retail businesses',
        slug: 'point-of-sale',
        icon: '',
        is_public: false,
        is_published: false,
        published_at: null,
        navigation: {
            initialPageId: 'pos-home'
        },
        pages: [
            {
                id: 'pos-home',
                order: 0,
                title: 'POS System',
                components: [
                    {
                        id: 'pos-header',
                        type: 'heading',
                        props: {
                            text: 'Point of Sale',
                            style: {}
                        },
                        gridRow: 0,
                        rowSpan: 1
                    },
                    {
                        id: 'product-search',
                        type: 'text-input',
                        props: {
                            label: 'Search Products',
                            placeholder: 'Scan or search for products'
                        },
                        gridRow: 1,
                        rowSpan: 1
                    },
                    {
                        id: 'quantity-input',
                        type: 'text-input',
                        props: {
                            label: 'Quantity',
                            placeholder: '1'
                        },
                        gridRow: 2,
                        rowSpan: 1
                    },
                    {
                        id: 'add-to-cart-btn',
                        type: 'button',
                        props: {
                            title: 'Add to Cart',
                            variant: 'primary'
                        },
                        gridRow: 3,
                        rowSpan: 1
                    },
                    {
                        id: 'checkout-btn',
                        type: 'button',
                        props: {
                            title: 'Checkout',
                            variant: 'secondary'
                        },
                        gridRow: 4,
                        rowSpan: 1
                    }
                ]
            }
        ],
        metadata: {
            revision: 1,
            createdBy: 'jane-smith'
        },
        created_at: '2026-02-12T15:45:00Z',
        updated_at: '2026-02-12T15:45:00Z'
    },
    '3': {
        id: 'event-registration',
        version: '1.0',
        name: 'Event Registration',
        description: 'Simple event registration and ticketing system',
        slug: 'event-registration',
        icon: '',
        is_public: false,
        is_published: false,
        published_at: null,
        navigation: {
            initialPageId: 'register'
        },
        pages: [
            {
                id: 'register',
                order: 0,
                title: 'Event Registration',
                components: [
                    {
                        id: 'event-header',
                        type: 'heading',
                        props: {
                            text: 'Event Registration',
                            style: {}
                        },
                        gridRow: 0,
                        rowSpan: 1
                    },
                    {
                        id: 'attendee-name',
                        type: 'text-input',
                        props: {
                            label: 'Full Name',
                            placeholder: 'Enter your name'
                        },
                        gridRow: 1,
                        rowSpan: 1
                    },
                    {
                        id: 'attendee-email',
                        type: 'text-input',
                        props: {
                            label: 'Email Address',
                            placeholder: 'your@email.com'
                        },
                        gridRow: 2,
                        rowSpan: 1
                    },
                    {
                        id: 'ticket-type',
                        type: 'select',
                        props: {
                            label: 'Ticket Type',
                            placeholder: 'Select ticket type',
                            options: [
                                { label: 'General Admission', value: 'general' },
                                { label: 'VIP', value: 'vip' },
                                { label: 'Student', value: 'student' }
                            ]
                        },
                        gridRow: 3,
                        rowSpan: 1
                    },
                    {
                        id: 'register-btn',
                        type: 'button',
                        props: {
                            title: 'Register Now',
                            variant: 'primary'
                        },
                        gridRow: 4,
                        rowSpan: 1
                    }
                ]
            }
        ],
        metadata: {
            revision: 1,
            createdBy: 'mike-johnson'
        },
        created_at: '2026-02-11T09:20:00Z',
        updated_at: '2026-02-11T09:20:00Z'
    }
};

export const AdminReviewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [activePanel, setActivePanel] = useState<'json' | 'preview'>('preview');

    const miniappSchema = id ? mockMiniappSchemas[id] : null;

    if (!miniappSchema) {
        return (
            <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Miniapp Not Found</h2>
                    <p className="text-muted-foreground mb-4">The requested miniapp could not be found.</p>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handleApprove = () => {
        toast.success(`${miniappSchema.name} has been approved!`);
        setTimeout(() => navigate('/admin/dashboard'), 1500);
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        toast.success(`${miniappSchema.name} has been rejected`);
        setShowRejectModal(false);
        setTimeout(() => navigate('/admin/dashboard'), 1500);
    };

    const formattedJson = JSON.stringify(miniappSchema, null, 2);

    return (
        <div className="dark min-h-screen bg-background text-foreground">
            <MainLayout showBuilderButtons={false}>
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="border-b border-border bg-card/50 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/admin/dashboard')}
                                    className="p-2 hover:bg-muted/40 rounded-xl transition-all"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">{miniappSchema.name}</h1>
                                    <p className="text-sm text-muted-foreground mt-1">{miniappSchema.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-600 rounded-xl font-semibold hover:bg-red-500/20 transition-all border border-red-500/20"
                                >
                                    <XCircle size={16} />
                                    Reject
                                </button>
                                <button
                                    onClick={handleApprove}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                                >
                                    <CheckCircle size={16} />
                                    Approve
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Panel Toggle (Mobile) */}
                    <div className="lg:hidden flex border-b border-border bg-muted/20">
                        <button
                            onClick={() => setActivePanel('preview')}
                            className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider transition-all ${activePanel === 'preview'
                                    ? 'text-primary border-b-2 border-primary bg-card'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Eye size={16} className="inline mr-2" />
                            Preview
                        </button>
                        <button
                            onClick={() => setActivePanel('json')}
                            className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider transition-all ${activePanel === 'json'
                                    ? 'text-primary border-b-2 border-primary bg-card'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Code size={16} className="inline mr-2" />
                            JSON Schema
                        </button>
                    </div>

                    {/* Two Panel Layout */}
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left Panel - JSON Schema */}
                        <div className={`${activePanel === 'json' ? 'flex' : 'hidden'} lg:flex lg:w-1/2 flex-col border-r border-border bg-card overflow-hidden`}>
                            <div className="border-b border-border bg-muted/20 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Code size={16} className="text-primary" />
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">JSON Schema</h2>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto custom-scrollbar bg-[#1e1e1e]">
                                <SyntaxHighlighter
                                    language="json"
                                    style={vscDarkPlus}
                                    customStyle={{
                                        margin: 0,
                                        padding: '1.5rem',
                                        fontSize: '12px',
                                        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                                        backgroundColor: 'transparent',
                                        lineHeight: '1.6',
                                    }}
                                    wrapLines={true}
                                >
                                    {formattedJson}
                                </SyntaxHighlighter>
                            </div>
                        </div>

                        {/* Right Panel - Preview */}
                        <div className={`${activePanel === 'preview' ? 'flex' : 'hidden'} lg:flex lg:w-1/2 flex-col bg-background/95 overflow-hidden`}>
                            <div className="border-b border-border bg-muted/20 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Eye size={16} className="text-primary" />
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">Live Preview</h2>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto flex items-start justify-center p-8 dot-pattern">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
                                <div className="relative z-10 mt-4">
                                    {/* Mobile Frame */}
                                    <div className="relative mx-auto" style={{ width: '375px' }}>
                                        <div className="bg-card rounded-[3rem] shadow-2xl border-[14px] border-gray-800 overflow-hidden">
                                            {/* Phone Notch */}
                                            <div className="bg-gray-800 h-8 flex items-center justify-center relative">
                                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl" />
                                            </div>

                                            {/* Screen Content */}
                                            <div className="bg-white" style={{ height: '667px', overflow: 'auto' }}>
                                                <SduiPage
                                                    schema={miniappSchema}
                                                    currentPageId={miniappSchema.navigation.initialPageId}
                                                    onAction={(actionId) => {
                                                        console.log('Action triggered:', actionId);
                                                    }}
                                                />
                                            </div>

                                            {/* Home Indicator */}
                                            <div className="bg-gray-800 h-6 flex items-center justify-center">
                                                <div className="w-32 h-1 bg-gray-600 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reject Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                                    <XCircle size={24} className="text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Reject Miniapp</h2>
                                    <p className="text-sm text-muted-foreground">Provide a reason for rejection</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Rejection Reason
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Explain why this miniapp is being rejected..."
                                    className="w-full px-4 py-3 bg-muted/40 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/40 resize-none"
                                    rows={4}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-muted/40 text-foreground rounded-xl font-semibold hover:bg-muted/60 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </MainLayout>
        </div>
    );
};
