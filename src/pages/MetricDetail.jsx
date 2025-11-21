import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Navigate } from 'react-router-dom';
import { Sparkles, Box } from 'lucide-react';
import MetricVisualizer from '../components/MetricVisualizer';
import MetaTags from '../components/MetaTags';

const MetricDetail = ({ metrics }) => {
    const { id } = useParams();
    const metric = metrics.find(m => m.id === id);
    const [activeTab, setActiveTab] = React.useState('guide');
    const [selectedContext, setSelectedContext] = React.useState('standard');

    // Reset context and tab when metric changes
    React.useEffect(() => {
        setSelectedContext('standard');
        // Reset to guide tab if metric doesn't have visualizations
        if (!metric?.visualizations) {
            setActiveTab('guide');
        }
    }, [id, metric]);

    if (!metric) return <Navigate to="/" />;

    // Define available contexts based on metric variations
    const contexts = [
        { id: 'standard', label: 'Standard / TRL (SFT)' },
        { id: 'trl-dpo', label: 'TRL (DPO)' },
        { id: 'trl-ppo', label: 'TRL (PPO)' },
        { id: 'trl-grpo', label: 'TRL (GRPO)' },
        { id: 'trl-orpo', label: 'TRL (ORPO)' },
        { id: 'trl-kto', label: 'TRL (KTO)' },
    ];

    // Filter contexts to only show relevant ones + standard
    const availableContexts = contexts.filter(c =>
        c.id === 'standard' || (metric.variations && metric.variations[c.id])
    );

    // Get current display data
    const currentVariation = metric.variations?.[selectedContext];
    const description = currentVariation?.description || metric.description;
    const whatToLookFor = currentVariation?.whatToLookFor || metric.whatToLookFor;

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
                        <div className="inline-block bg-black text-white px-4 py-1 font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_#FFDE00]">
                            Metric Definition
                        </div>

                        {/* Context Selector */}
                        {availableContexts.length > 1 && (
                            <div className="flex items-center gap-2 bg-white border-2 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <span className="text-xs font-bold uppercase px-2">Context:</span>
                                <select
                                    value={selectedContext}
                                    onChange={(e) => setSelectedContext(e.target.value)}
                                    className="bg-transparent font-bold text-sm focus:outline-none cursor-pointer"
                                >
                                    {availableContexts.map(ctx => (
                                        <option key={ctx.id} value={ctx.id}>{ctx.label}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 text-black tracking-tighter">
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
                        <h2 className="text-3xl font-black mb-6 flex items-center gap-3">
                            <span className="bg-accent-cyan border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <Sparkles className="w-5 h-5 text-black" />
                            </span>
                            What is it?
                        </h2>
                        <div className="relative z-10 prose prose-invert max-w-none">
                            <ReactMarkdown>{description}</ReactMarkdown>
                        </div>

                        {selectedContext !== 'standard' && (
                            <div className="mt-6 p-4 bg-accent-yellow/20 border-2 border-black/10 rounded-none flex items-start gap-3">
                                <div className="bg-accent-yellow text-black font-bold text-xs px-2 py-1 border border-black">NOTE</div>
                                <p className="text-sm font-medium">
                                    You are viewing specific details for <strong>{contexts.find(c => c.id === selectedContext)?.label}</strong>.
                                    These may differ significantly from standard behavior.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-4 border-b-2 border-black/10 pb-1">
                        <button
                            onClick={() => setActiveTab('guide')}
                            className={`px-6 py-3 font-black uppercase tracking-wider text-sm border-2 transition-all ${activeTab === 'guide'
                                ? 'bg-accent-yellow text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                                : 'bg-transparent border-transparent text-text-muted hover:text-black hover:bg-black/5'
                                }`}
                        >
                            What to look for
                        </button>
                        {metric.visualizations && (
                            <button
                                onClick={() => setActiveTab('visualizer')}
                                className={`px-6 py-3 font-black uppercase tracking-wider text-sm border-2 transition-all ${activeTab === 'visualizer'
                                    ? 'bg-accent-cyan text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                                    : 'bg-transparent border-transparent text-text-muted hover:text-black hover:bg-black/5'
                                    }`}
                            >
                                Visualization
                            </button>
                        )}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === 'guide' ? (
                            <div className="neo-card p-8 bg-white text-black animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h2 className="text-3xl font-black mb-8 text-accent-yellow" style={{ WebkitTextStroke: '1px black' }}>Key Signals</h2>
                                <ul className="space-y-4">
                                    {whatToLookFor.map((item, index) => (
                                        <li key={index} className="flex items-start gap-4 group">
                                            <span className="flex-shrink-0 w-8 h-8 bg-white text-black border-2 border-white font-black flex items-center justify-center shadow-[4px_4px_0px_0px_#FF0080]">
                                                {index + 1}
                                            </span>
                                            <span className="text-lg font-medium pt-1">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : activeTab === 'visualizer' && metric.visualizations ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <MetricVisualizer metric={metric} />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MetricDetail;
