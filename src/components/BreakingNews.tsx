import React, { useEffect, useState } from 'react';
import { breakingNewsAPI, BreakingNews as BreakingNewsType } from '../services/api';

const BreakingNews: React.FC = () => {
    const [newsList, setNewsList] = useState<BreakingNewsType[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await breakingNewsAPI.getActive();
                if (response.success && response.data) {
                    // Ensure response.data is an array
                    const data = Array.isArray(response.data) ? response.data : [response.data];
                    setNewsList(data);
                }
            } catch (error) {
                console.error('Failed to fetch breaking news', error);
            }
        };
        fetchNews();
    }, []);

    if (newsList.length === 0) return null;

    return (
        <div className="bg-red-600 text-white h-10 overflow-hidden relative flex items-center w-full">
            <div className="bg-red-800 px-4 h-full flex items-center z-10 font-bold whitespace-nowrap shadow-md absolute left-0 top-0">
                BREAKING NEWS
            </div>
            <div className="w-full overflow-hidden relative h-full flex items-center">
                <div className="animate-marquee whitespace-nowrap pause-on-hover flex">
                    <span className="text-lg font-medium px-4 flex items-center">
                        {newsList.map((item, index) => (
                            <span key={`original-${item.id}`} className="flex items-center">
                                {item.content}
                                <span className="mx-8 text-red-300">•</span>
                            </span>
                        ))}
                    </span>
                    {/* Duplicate content for seamless scrolling */}
                    <span className="text-lg font-medium px-4 flex items-center">
                        {newsList.map((item, index) => (
                            <span key={`duplicate-${item.id}`} className="flex items-center">
                                {item.content}
                                <span className="mx-8 text-red-300">•</span>
                            </span>
                        ))}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BreakingNews;
