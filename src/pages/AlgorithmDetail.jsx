import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Navigate } from 'react-router-dom';
import { Activity, Sparkles, Box } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import MetaTags from '../components/MetaTags';

const AlgorithmDetail = ({ algorithms, metrics }) => {
    const { id } = useParams();
    const algo = algorithms.find(a => a.id === id);

    if (!algo) return <Navigate to="/" />;

    const relevantMetrics = metrics.filter(m => algo.relevantMetrics.includes(m.id));

    return (
        <>
            <MetaTags
                title={`What is ${algo.fullName}? | metrics.help`}
                description={algo.shortDescription}
                image={`https://metrics.help/og/algorithm-${algo.id}.png`}
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'TechArticle',
                    headline: `What is ${algo.fullName}?`,
                    description: algo.shortDescription,
                    image: `https://metrics.help/og/algorithm-${algo.id}.png`,
                    url: `https://metrics.help/algorithm/${algo.id}`,
                    publisher: {
                        '@type': 'Organization',
                        name: 'metrics.help',
                        url: 'https://metrics.help'
                    },
                    mainEntityOfPage: {
                        '@type': 'WebPage',
                        '@id': `https://metrics.help/algorithm/${algo.id}`
                    }
                }}
            />
            <div className="animate-in fade-in max-w-5xl mx-auto pt-20 md:pt-8 pb-20 px-4 md:px-6">
                <header className="mb-12 relative">
                    <div className="inline-block bg-black text-white px-4 py-1 font-black uppercase tracking-widest text-xs mb-4 shadow-[4px_4px_0px_0px_#FFDE00]">
                        Algorithm Guide
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 text-black tracking-tighter">
                        {algo.fullName}
                    </h1>
                    <p className="text-xl md:text-2xl text-text-muted font-medium leading-relaxed max-w-3xl border-l-4 border-accent-cyan pl-4 md:pl-6">
                        {algo.shortDescription}
                    </p>
                </header>

                <div className="grid gap-8">
                    <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                        <span className="bg-accent-cyan border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Sparkles className="w-5 h-5 text-black" />
                        </span>
                        Deep Dive
                    </h2>
                    <div className="neo-card p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Box size={120} strokeWidth={1} />
                        </div>
                        <div className="relative z-10 prose prose-invert max-w-none">
                            <ReactMarkdown>{algo.description}</ReactMarkdown>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                        <span className="bg-accent-pink border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Activity className="w-5 h-5 text-black" />
                        </span>
                        Key Metrics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {relevantMetrics.map(metric => (
                            <MetricCard key={metric.id} metric={metric} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlgorithmDetail;
