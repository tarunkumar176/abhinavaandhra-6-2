import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, ArrowRight } from 'lucide-react';
import { Paper } from '../../types';
import { paperAPI } from '../../services/api';
import { formatDisplayDate } from '../../utils/dateUtils';

const PreviousEditions: React.FC = () => {
    const [papers, setPapers] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPreviousEditions();
    }, []);

    const fetchPreviousEditions = async () => {
        try {
            setLoading(true);
            const response = await paperAPI.getLatest(7);
            if (response.success && response.data) {
                setPapers(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch previous editions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToPaper = (date: string) => {
        navigate(`/paper/${date}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-telugu-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Previous Editions</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Browse through our archive of the last 7 days of e-papers.
                    </p>
                </div>

                {papers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {papers.map((paper) => (
                            <div
                                key={paper.id}
                                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                onClick={() => handleNavigateToPaper(paper.date)}
                            >
                                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                                    {paper.thumbnailUrl ? (
                                        <img
                                            src={paper.thumbnailUrl}
                                            alt={paper.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <FileText className="h-16 w-16 mb-2" />
                                            <span className="text-sm font-medium">No Preview</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-gray-900 px-4 py-2 rounded-full font-semibold shadow-lg flex items-center gap-2">
                                            <span>Read Now</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDisplayDate(paper.date)}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-telugu-primary transition-colors">
                                        {paper.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-200">
                        <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Papers Found</h3>
                        <p className="text-gray-600">We couldn't find any recent editions.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreviousEditions;
