import React from 'react';
import ReactMarkdown from 'react-markdown';
import MetaTags from '../components/MetaTags';
import changelog from '../content/changelog.md?raw';

const Changelog = () => (
    <>
        <MetaTags title="Changelog | metrics.help" description="What's new and what's been corrected on metrics.help." />
        <div className="animate-in fade-in max-w-4xl mx-auto pt-20 md:pt-8 pb-20 px-4 md:px-6">
            <header className="mb-10">
                <div className="inline-block bg-black text-white px-4 py-1 font-black uppercase tracking-widest text-xs mb-4 shadow-[4px_4px_0px_0px_#FFDE00]">
                    Updates
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter">Changelog</h1>
            </header>
            <div className="neo-card p-8 prose prose-invert max-w-none">
                <ReactMarkdown>{changelog}</ReactMarkdown>
            </div>
        </div>
    </>
);

export default Changelog;
