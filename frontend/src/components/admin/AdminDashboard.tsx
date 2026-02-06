import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  FileText,
  Calendar,
  Trash2,
  Download,
  RefreshCw,
  Plus,
  Eye,
  Megaphone
} from 'lucide-react';
import { Paper } from '../../types';
import { paperAPI, breakingNewsAPI, BreakingNews } from '../../services/api';
import { formatDisplayDate } from '../../utils/dateUtils';
import { formatFileSize } from '../../utils/imageUtils';
import toast from 'react-hot-toast';
import AdsPage from './AdsPage';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ads'>('overview');
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [breakingNewsList, setBreakingNewsList] = useState<BreakingNews[]>([]);
  const [newBreakingNews, setNewBreakingNews] = useState('');
  const [addingNews, setAddingNews] = useState(false);
  const [deletingNews, setDeletingNews] = useState<number | null>(null);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchPapers();
      fetchBreakingNews();
    }
  }, [activeTab]);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const response = await paperAPI.getAll();
      if (response.success && response.data) {
        setPapers(response.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (error) {
      toast.error('Failed to fetch papers');
    } finally {
      setLoading(false);
    }
  };

  const fetchBreakingNews = async () => {
    try {
      const response = await breakingNewsAPI.getActive();
      if (response.success && response.data) {
        const data = Array.isArray(response.data) ? response.data : [response.data];
        setBreakingNewsList(data);
      }
    } catch (error) {
      console.error('Failed to fetch breaking news', error);
    }
  };

  const handleAddBreakingNews = async () => {
    if (!newBreakingNews.trim()) return;

    try {
      setAddingNews(true);
      const response = await breakingNewsAPI.update(newBreakingNews, true);
      if (response.success) {
        toast.success('Breaking news added successfully');
        setNewBreakingNews('');
        fetchBreakingNews();
      }
    } catch (error) {
      toast.error('Failed to add breaking news');
    } finally {
      setAddingNews(false);
    }
  };

  const handleDeleteBreakingNews = async (id: number) => {
    try {
      setDeletingNews(id);
      const response = await breakingNewsAPI.delete(id);
      if (response.success) {
        setBreakingNewsList(prev => prev.filter(item => item.id !== id));
        toast.success('Breaking news deleted');
      }
    } catch (error) {
      toast.error('Failed to delete breaking news');
    } finally {
      setDeletingNews(null);
    }
  };

  const handleDelete = async (paper: Paper) => {
    if (!confirm(`Are you sure you want to delete "${paper.title}"?`)) {
      return;
    }

    try {
      setDeleting(paper.id);
      const response = await paperAPI.delete(paper.id);
      if (response.success) {
        setPapers(prev => prev.filter(p => p.id !== paper.id));
        toast.success('Paper deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete paper');
    } finally {
      setDeleting(null);
    }
  };

  const totalSize = papers.reduce((sum, paper) => sum + paper.fileSize, 0);
  const totalPages = papers.reduce((sum, paper) => sum + paper.pageCount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your E-Paper uploads and editions
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'overview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'ads'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Megaphone className="w-4 h-4" />
            Ads
          </button>
        </div>
      </div>

      {activeTab === 'ads' ? (
        <AdsPage />
      ) : (
        <>
          {/* Original Dashboard Content */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchPapers}
                className="flex items-center space-x-2 btn-secondary"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>

              <Link to="/admin/upload" className="flex items-center space-x-2 btn-primary">
                <Plus className="h-4 w-4" />
                <span>Upload Paper</span>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Papers</p>
                  <p className="text-2xl font-bold text-gray-900">{papers.length}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pages</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPages}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Size</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatFileSize(totalSize)}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-telugu-primary/10 p-3 rounded-lg">
                  <Upload className="h-6 w-6 text-telugu-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Latest Upload</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {papers.length > 0 ? formatDisplayDate(papers[0].date) : 'None'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Breaking News Management */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Breaking News</h2>

            {/* Add New */}
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={newBreakingNews}
                onChange={(e) => setNewBreakingNews(e.target.value)}
                placeholder="Add new breaking news..."
                className="input-field flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddBreakingNews()}
              />
              <button
                onClick={handleAddBreakingNews}
                disabled={addingNews || !newBreakingNews.trim()}
                className="btn-primary flex items-center space-x-2"
              >
                {addingNews ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>Add</span>
              </button>
            </div>

            {/* List Active */}
            <div className="space-y-3">
              {breakingNewsList.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No active breaking news.</p>
              ) : (
                breakingNewsList.map((news) => (
                  <div key={news.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="text-gray-800 font-medium">{news.content}</span>
                    <button
                      onClick={() => handleDeleteBreakingNews(news.id)}
                      disabled={deletingNews === news.id}
                      className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      {deletingNews === news.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Papers Table */}
          <div className="card">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Uploaded Papers</h2>
            </div>
            {/* Table Content (Simplified for brevity, assuming standard rendering) */}
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-telugu-primary"></div>
              </div>
            ) : papers.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Papers Uploaded</h3>
                <p className="text-gray-600 mb-4">
                  Start by uploading your first Abhinavandhra newspaper edition.
                </p>
                <Link to="/admin/upload" className="btn-primary inline-flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Paper
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paper Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size & Pages
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {papers.map((paper) => (
                      <tr key={paper.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-telugu-primary/10 p-2 rounded-lg mr-3">
                              <FileText className="h-5 w-5 text-telugu-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {paper.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {paper.filename}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDisplayDate(paper.date)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {paper.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatFileSize(paper.fileSize)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {paper.pageCount} pages
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(paper.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(paper.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/paper/${paper.date}`}
                              className="text-telugu-primary hover:text-telugu-secondary"
                              title="View Paper"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            <a
                              href={paper.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </a>

                            <button
                              onClick={() => handleDelete(paper)}
                              disabled={deleting === paper.id}
                              className="text-red-600 hover:text-red-700 disabled:opacity-50"
                              title="Delete Paper"
                            >
                              {deleting === paper.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;