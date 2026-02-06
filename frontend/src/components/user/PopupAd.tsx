import React, { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface PopupAdProps {
    imageUrl: string;
    linkUrl?: string; // Optional link
    duration?: number; // Duration in seconds
    onClose: () => void;
}

const PopupAd: React.FC<PopupAdProps> = ({
    imageUrl,
    linkUrl,
    duration = 5,
    onClose
}) => {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) {
            onClose();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onClose]);

    const handleAdClick = () => {
        if (linkUrl) {
            window.open(linkUrl, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-md md:max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Timer / Close Header */}
                <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-2">
                    <span className="font-mono text-sm font-semibold text-yellow-400">
                        Ad closes in {timeLeft}s
                    </span>
                    {/* Optional: Allow close after 5s? Requirement says "ad should also show the closing timer of 5 seconds". 
            Interpretation: It auto-closes. But user might be stuck? 
            Let's keep it strictly auto-close logic for now, or allow close button only if user insists. 
            For now, showing close button but maybe disable it?
            Actually UI wise, a close button is expected. Let's make it clickable only when timer is done? 
            Or let's just make it auto-close as per request "closing timer". 
            I'll add a close button that is always active to be user friendly, OR strict 5s? 
            Let's stick to strict 5s as per prompt implication of "interstitial". 
            Actually, let's just provide the button just in case. */}
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-800 rounded-full transition-colors"
                        title="Close Ad"
                    >
                        <X className="w-5 h-5 text-gray-400 hover:text-white" />
                    </button>
                </div>

                {/* Ad Content */}
                <div
                    className={`relative group ${linkUrl ? 'cursor-pointer' : ''}`}
                    onClick={handleAdClick}
                >
                    <img
                        src={imageUrl}
                        alt="Advertisement"
                        className="w-full h-auto object-contain max-h-[70vh] bg-gray-100"
                    />

                    {linkUrl && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                            <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-semibold shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                <ExternalLink className="w-4 h-4" />
                                Visit Website
                            </span>
                        </div>
                    )}
                </div>

                {/* Footer/Progress Bar */}
                <div className="h-1 bg-gray-100 w-full">
                    <div
                        className="h-full bg-telugu-secondary transition-all duration-1000 ease-linear"
                        style={{ width: `${(timeLeft / duration) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default PopupAd;
