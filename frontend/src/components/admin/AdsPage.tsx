import React, { useState, useEffect } from 'react';
import { Trash2, Upload, Eye, EyeOff, Plus, ExternalLink, Loader2 } from 'lucide-react';
import { adsAPI, Ad } from '../../services/api';
import toast from 'react-hot-toast';

const AdsPage: React.FC = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUploadForm, setShowUploadForm] = useState(false);

    // Upload Form State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [linkUrl, setLinkUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            setLoading(true);
            const response = await adsAPI.getAll();
            if (response.success && response.data) {
                setAds(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch ads');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error('Please select an image');
            return;
        }

        try {
            setUploading(true);
            const response = await adsAPI.create(selectedFile, linkUrl);
            if (response.success) {
                toast.success('Ad created successfully');
                setShowUploadForm(false);
                setSelectedFile(null);
                setLinkUrl('');
                fetchAds(); // Refresh list
            } else {
                toast.error(response.message || 'Failed to create ad');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setUploading(false);
        }
    };

    const handleToggle = async (id: number) => {
        try {
            const response = await adsAPI.toggle(id);
            if (response.success && response.data) {
                setAds(prev => prev.map(ad =>
                    ad.id === id ? { ...ad, is_active: response.data!.is_active } : ad
                ));
                toast.success(response.message || 'Status updated');
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this ad?')) return;

        try {
            const response = await adsAPI.delete(id);
            if (response.success) {
                setAds(prev => prev.filter(ad => ad.id !== id));
                toast.success('Ad deleted');
            }
        } catch (error) {
            toast.error('Failed to delete ad');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manage Popup Ads</h2>
                    <p className="text-gray-500 text-sm">Create and manage interstitial ads displayed before reading.</p>
                </div>
                <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="btn-primary flex items-center gap-2"
                >
                    {showUploadForm ? 'Cancel' : (
                        <>
                            <Plus className="w-5 h-5" />
                            Add New Ad
                        </>
                    )}
                </button>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-semibold mb-4">Upload New Ad</h3>
                    <form onSubmit={handleUpload} className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-telugu-primary file:text-white
                          hover:file:bg-telugu-secondary"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">Recommended size: 800x600 or larger. Max 5MB.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Target URL (Optional)</label>
                            <div className="relative">
                                <ExternalLink className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="url"
                                    placeholder="https://example.com"
                                    value={linkUrl}
                                    onChange={e => setLinkUrl(e.target.value)}
                                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-telugu-primary focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={uploading || !selectedFile}
                                className="w-full sm:w-auto px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Uploading...
                                    </>
                                ) : 'Create Ad'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Ads List */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    <p className="text-gray-500 mt-2">Loading ads...</p>
                </div>
            ) : ads.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No ads found</h3>
                    <p className="text-gray-500 mb-6">Get started by creating your first popup ad.</p>
                    <button
                        onClick={() => setShowUploadForm(true)}
                        className="text-telugu-primary font-semibold hover:underline"
                    >
                        Create Ad Now
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {ads.map((ad) => (
                        <div key={ad.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden group transition-all hover:shadow-md ${!ad.is_active ? 'opacity-75' : ''}`}>
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                <img
                                    src={ad.image_url}
                                    alt={`Ad ${ad.id}`}
                                    className="w-full h-full object-contain"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <span className={`px-2 py-1 rounded-md text-xs font-semibold shadow-sm ${ad.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {ad.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 truncate">
                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                    {ad.link_url ? (
                                        <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="hover:text-telugu-primary truncate">
                                            {ad.link_url}
                                        </a>
                                    ) : (
                                        <span className="italic">No link</span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">
                                        {new Date(ad.created_at).toLocaleDateString()}
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggle(ad.id)}
                                            className={`p-2 rounded-lg transition-colors ${ad.is_active ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                            title={ad.is_active ? "Deactivate" : "Activate"}
                                        >
                                            {ad.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ad.id)}
                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdsPage;
