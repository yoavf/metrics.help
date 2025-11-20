import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingDown, Target, Crosshair, Search } from 'lucide-react';

const icons = {
    loss: TrendingDown,
    accuracy: Target,
    precision: Crosshair,
    recall: Search,
};

const colors = {
    loss: 'bg-accent-yellow',
    accuracy: 'bg-accent-pink',
    precision: 'bg-accent-cyan',
    recall: 'bg-accent-yellow', // Reusing yellow for balance
};

const MetricCard = ({ metric }) => {
    const Icon = icons[metric.id] || Target;
    const colorClass = colors[metric.id] || 'bg-accent-yellow';

    return (
        <Link
            to={`/metric/${metric.id}`}
            className="neo-card block p-6 group hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 border-2 border-black ${colorClass} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                    <Icon className="w-6 h-6 text-black" strokeWidth={2.5} />
                </div>
            </div>

            <h3 className="text-xl font-black uppercase mb-2 text-black group-hover:underline decoration-2 underline-offset-4">
                {metric.name}
            </h3>

            <p className="text-text-muted font-medium leading-relaxed">
                {metric.shortDescription}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                <span>Learn more</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
        </Link>
    );
};

export default MetricCard;
