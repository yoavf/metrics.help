import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Sparkles, Box } from 'lucide-react';
import MetricVisualizer from '../components/MetricVisualizer';
import MetaTags from '../components/MetaTags';
import ReviewedNote from '../components/ReviewedNote';

const MetricDetail = ({ metrics }) => {
    const { id } = useParams();
    const metric = metrics.find(m => m.id === id);
    const [activeTab, setActiveTab] = React.useState('guide');

    // Reset to guide tab if metric doesn't have visualizations
    React.useEffect(() => {
        if (!metric?.visualizations) {
            setActiveTab('guide');
        }
    }, [id, metric]);

    if (!metric) return <Navigate to="/" />;

    // Find parent metric if this is a child
    const parentMetric = metric.parent ? metrics.find(m => m.id === metric.parent) : null;

    // Find child metrics if this is a parent, with Standard first
    const childMetrics = metrics
        .filter(m => m.parent === metric.id)
        .sort((a, b) => {
            if (a.id.endsWith('-standard')) return -1;
            if (b.id.endsWith('-standard')) return 1;
            return 0;
        });

    // Use parent's visualizations if child doesn't have its own
    const visualizations = metric.visualizations || parentMetric?.visualizations;

    return (
        <>
            <MetaTags
                title={`What is ${metric.name}? | metrics.help`}
                description={metric.shortDescription}
                image={`https://metrics.help/og/metric-${metric.id}.png`}
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'TechArticle',
                    headline: `What is ${metric.name}?`,
                    description: metric.shortDescription,
                    image: `https://metrics.help/og/metric-${metric.id}.png`,
                    url: `https://metrics.help/metric/${metric.id}`,
                    publisher: {
                        '@type': 'Organization',
                        name: 'metrics.help',
                        url: 'https://metrics.help'
                    },
                    mainEntityOfPage: {
                        '@type': 'WebPage',
                        '@id': `https://metrics.help/metric/${metric.id}`
                    }
                }}
            />
            <div className="animate-in fade-in max-w-5xl mx-auto pt-20 md:pt-8 pb-20 px-4 md:px-6">
                <header className="mb-12 relative">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="inline-block bg-black text-white px-4 py-1 font-bold uppercase tracking-widest text-xs shadow-sm">
                            Metric Definition
                        </div>

                        {/* Breadcrumb for child metrics */}
                        {parentMetric && (
                            <Link
                                to={`/metric/${parentMetric.id}`}
                                className="text-sm font-bold text-text-muted hover:text-black transition-colors"
                            >
                                ← Back to {parentMetric.name}
                            </Link>
                        )}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-black tracking-tight">
                        {metric.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-text-muted font-medium leading-relaxed max-w-3xl border-l-4 border-accent-pink pl-4 md:pl-6">
                        {metric.shortDescription}
                    </p>
                </header>

                <div className="grid gap-8">
                    <div className="neo-card p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Box size={120} strokeWidth={1} />
                        </div>
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <span className="bg-accent-cyan border border-black/10 p-1 shadow-sm">
                                <Sparkles className="w-5 h-5 text-black" />
                            </span>
                            What is it?
                        </h2>
                        <div className="relative z-10 prose prose-invert max-w-none">
                            <ReactMarkdown>{metric.description}</ReactMarkdown>
                        </div>
                        <ReviewedNote date={metric.lastReviewed} />

                        {/* Show child variants if this is a parent with children */}
                        {childMetrics.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-black/10/10">
                                <h3 className="text-lg font-bold uppercase mb-4">Algorithm-Specific Variants</h3>
                                <div className="flex flex-wrap gap-2">
                                    {childMetrics.map(child => {
                                        const variantName = child.name.match(/\(([^)]+)\)/)?.[1] || child.name;
                                        return (
                                            <Link
                                                key={child.id}
                                                to={`/metric/${child.id}`}
                                                className="px-4 py-2 bg-white border border-black/10 font-bold text-sm hover:bg-accent-yellow hover:shadow-sm transition-all"
                                            >
                                                {variantName}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabs Navigation - only show if metric has content */}
                    {(metric.whatToLookFor || visualizations) && (
                        <div className="flex gap-4 border-b border-black/10/10 pb-1">
                            {metric.whatToLookFor && (
                                <button
                                    onClick={() => setActiveTab('guide')}
                                    className={`px-6 py-3 font-bold uppercase tracking-wider text-sm border transition-all ${activeTab === 'guide'
                                        ? 'bg-accent-yellow text-black border-black shadow-sm -translate-y-1'
                                        : 'bg-black/5 border-transparent text-text-muted hover:text-black hover:bg-black/10'
                                        }`}
                                >
                                    What to look for
                                </button>
                            )}
                            {visualizations && (
                                <button
                                    onClick={() => setActiveTab('visualizer')}
                                    className={`px-6 py-3 font-bold uppercase tracking-wider text-sm border transition-all ${activeTab === 'visualizer'
                                        ? 'bg-accent-cyan text-black border-black shadow-sm -translate-y-1'
                                        : 'bg-black/5 border-transparent text-text-muted hover:text-black hover:bg-black/10'
                                        }`}
                                >
                                    Visualization
                                </button>
                            )}
                        </div>
                    )}

                    {/* Tab Content */}
                    {(metric.whatToLookFor || visualizations) && (
                        <div className="min-h-[400px]">
                            {activeTab === 'guide' && metric.whatToLookFor ? (
                                <div className="neo-card p-8 bg-white text-black animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <h2 className="flex items-center gap-3 text-2xl font-bold mb-8 text-black">
                                        <span className="w-1.5 h-6 rounded-full bg-accent-yellow" />
                                        Key Signals
                                    </h2>
                                    <ul className="space-y-4">
                                        {metric.whatToLookFor.map((item, index) => (
                                            <li key={index} className="flex items-start gap-4 group">
                                                <span className="flex-shrink-0 w-8 h-8 bg-white text-black border border-white font-bold flex items-center justify-center shadow-sm">
                                                    {index + 1}
                                                </span>
                                                <span className="text-lg font-medium pt-1">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : activeTab === 'visualizer' && visualizations ? (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <MetricVisualizer metric={{ ...metric, visualizations }} />
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MetricDetail;
