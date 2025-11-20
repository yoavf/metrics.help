import React from 'react';
import MetricCard from '../components/MetricCard';
import LogAnalyzer from '../components/LogAnalyzer';

const LandingPage = ({ metrics }) => (
    <div className="animate-in fade-in pt-16 pb-20 px-4 md:px-6 max-w-7xl mx-auto overflow-x-hidden">
        <header className="mb-20 relative">
            {/* Decorative Elements */}
            <div className="absolute -top-10 right-0 w-32 h-32 bg-accent-yellow border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-12 hidden md:block"></div>
            <div className="absolute top-2 -left-6 w-12 h-12 bg-accent-pink border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hidden md:block"></div>

            <div className="relative z-10 max-w-6xl">
                <div className="inline-block bg-accent-cyan border-2 border-black px-4 py-2 font-black uppercase tracking-wider text-sm mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    Welcome
                </div>
                <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                        understand <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-pink" style={{ WebkitTextStroke: '1.5px black' }}>
                            the metrics
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-text-muted font-medium max-w-md leading-relaxed border-l-4 md:border-l-8 border-accent-yellow pl-4 md:pl-6 mb-2">
                        Machine learning metrics and algorithms, explained.
                    </p>
                </div>
            </div>
        </header>

        {/* Log Analyzer Section */}
        <section className="mb-24">
            <LogAnalyzer />
        </section>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {metrics.map(metric => (
                <MetricCard key={metric.id} metric={metric} />
            ))}
        </div>
    </div>
);

export default LandingPage;
