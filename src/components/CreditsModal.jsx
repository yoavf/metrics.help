import React from 'react';
import { Info, X } from 'lucide-react';

const CreditsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={onClose}>
            <div className="bg-white border border-black/10 rounded-xl shadow-sm max-w-md w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-accent-pink transition-colors border border-black/10"
                >
                    <X size={20} />
                </button>

                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <span className="bg-accent-yellow border border-black/10 p-1 shadow-sm">
                        <Info className="w-5 h-5 text-black" />
                    </span>
                    Credits
                </h2>

                <div className="space-y-4 text-text-main">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Created by</h3>
                        <div className="flex items-center gap-3">
                            <p className="font-medium"><a href="https://yoav.blog" className="hover:underline">Yoav Farhi</a></p>
                            <div className="flex gap-2">
                                <a
                                    href="https://linkedin.com/in/yoavf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-1 bg-accent-cyan border border-black/10 text-xs font-bold uppercase hover:shadow-sm transition-all"
                                >
                                    LinkedIn
                                </a>
                                <a
                                    href="https://github.com/yoavf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-1 bg-accent-pink border border-black/10 text-xs font-bold uppercase hover:shadow-sm transition-all"
                                >
                                    GitHub
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-2">License</h3>
                        <p className="font-medium">Code: <a href="https://github.com/yoavf/metrics.help/blob/main/LICENSE">MIT</a> </p>
                        <p className="font-medium">Content: <a href="https://creativecommons.org/publicdomain/zero/1.0/">CC0</a> </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditsModal;
