import React from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingDown, Target, Crosshair, Search, Activity, Zap,
    Gauge, BarChart3, Percent, GitBranch, Shuffle, Scale,
    Trophy, CheckCircle, Hash, FileText, Sigma
} from 'lucide-react';

const icons = {
    loss: TrendingDown,
    accuracy: Target,
    precision: Crosshair,
    recall: Search,
    f1: Scale,
    perplexity: Shuffle,
    entropy: Activity,
    kl: GitBranch,
    rewards: Trophy,
    reward_accuracy: CheckCircle,
    clip_ratio: Percent,
    grad_norm: BarChart3,
    learning_rate: Gauge,
    token_accuracy: Hash,
    completions: FileText,
    mean_token_accuracy: Sigma,
};

const colors = {
    loss: 'bg-accent-yellow',
    accuracy: 'bg-accent-pink',
    precision: 'bg-accent-cyan',
    recall: 'bg-accent-yellow',
    f1: 'bg-accent-pink',
    perplexity: 'bg-accent-cyan',
    entropy: 'bg-accent-yellow',
    kl: 'bg-accent-pink',
    rewards: 'bg-accent-yellow',
    reward_accuracy: 'bg-accent-cyan',
    clip_ratio: 'bg-accent-pink',
    grad_norm: 'bg-accent-cyan',
    learning_rate: 'bg-accent-yellow',
    token_accuracy: 'bg-accent-pink',
    completions: 'bg-accent-cyan',
    mean_token_accuracy: 'bg-accent-yellow',
};

const MetricCard = ({ metric }) => {
    const Icon = icons[metric.id] || Target;
    const colorClass = colors[metric.id] || 'bg-accent-yellow';

    return (
        <Link
            to={`/metric/${metric.id}`}
            className="neo-card block p-6 group hover:-translate-y-1 hover:translate-x-1 hover:shadow-sm transition-all duration-200"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 border border-black/10 ${colorClass} shadow-sm`}>
                    <Icon className="w-6 h-6 text-black" strokeWidth={2.5} />
                </div>
            </div>

            <h3 className="text-xl font-bold uppercase mb-2 text-black group-hover:underline decoration-2 underline-offset-4">
                {metric.name}
            </h3>

            <p className="text-text-muted font-medium leading-relaxed">
                {metric.shortDescription}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                <span>Learn more</span>
                <span className=" transition-transform">→</span>
            </div>
        </Link>
    );
};

export default MetricCard;
