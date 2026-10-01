import React from 'react';
import ReactMarkdown from 'react-markdown';
import MetaTags from '../components/MetaTags';
import changelog from '../content/changelog.md?raw';

// Render the markdown as a quiet timeline: dates as markers, sections as small labels.
const components = {
    h2: ({ children }) => (
        <h2 className="relative mt-14 first:mt-0 mb-5 text-sm font-semibold tracking-wide text-black">
            <span className="absolute -left-[33px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-yellow ring-4 ring-bg border border-black/60" />
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 className="mt-6 mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">{children}</h3>
    ),
    ul: ({ children }) => <ul className="space-y-2.5 mb-2">{children}</ul>,
    li: ({ children }) => (
        <li className="relative pl-4 text-[15px] leading-relaxed text-black/80 before:content-[''] before:absolute before:left-0 before:top-[0.7em] before:w-1.5 before:h-px before:bg-black/40">
            {children}
        </li>
    ),
    p: ({ children }) => <p className="text-[15px] leading-relaxed text-black/80">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
    code: ({ children }) => <code className="font-mono text-[13px] bg-black/[0.05] px-1 py-0.5 rounded">{children}</code>,
};

const Changelog = () => (
    <>
        <MetaTags title="Changelog | metrics.help" description="What's new and what's been corrected on metrics.help." />
        <div className="animate-in fade-in max-w-3xl mx-auto pt-20 md:pt-14 pb-24 px-4 md:px-6">
            <header className="mb-14">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted mb-3">Updates</p>
                <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight">Changelog</h1>
                <p className="mt-3 text-text-muted">What's new and what's been corrected on metrics.help.</p>
            </header>
            <div className="border-l border-black/15 pl-8 ml-1.5">
                <ReactMarkdown components={components}>{changelog}</ReactMarkdown>
            </div>
        </div>
    </>
);

export default Changelog;
