import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, AlertCircle, CheckCircle, ArrowRight, Search } from 'lucide-react';
import { getMetrics } from '../utils/content';

const metrics = getMetrics();

const placeholders = [
    "{'loss': 0.0736, 'grad_norm': 1.39, 'learning_rate': 5e-06, 'reward': 0.72, 'entropy': 0.07}",
    "{'eval_loss': 0.62, 'eval_runtime': 0.29, 'eval_entropy': 0.58, 'epoch': 1.0}",
    "{'accuracy': 0.94, 'precision': 0.88, 'recall': 0.91, 'val_loss': 0.12}",
    "loss: 2.4, accuracy: 0.35, learning_rate: 0.001, epoch: 0"
];

const LogAnalyzer = () => {
    const [input, setInput] = useState('');
    const [parsedData, setParsedData] = useState(null);
    const [error, setError] = useState(null);
    const [detectedMetrics, setDetectedMetrics] = useState([]);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isFocused, setIsFocused] = useState(false);

    // Rotate placeholders
    useEffect(() => {
        if (input || isFocused) return;

        const interval = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [input, isFocused]);

    useEffect(() => {
        if (!input.trim()) {
            setParsedData(null);
            setDetectedMetrics([]);
            setError(null);
            return;
        }

        try {
            let data = {};

            // Lenient Parsing Strategy
            // We don't strictly require JSON. We look for "key: value" or "key=value" patterns.
            // This covers JSON, Python dicts, and standard log lines.

            // Regex explanation:
            // ['"]? -> Optional quote
            // ([a-zA-Z0-9_./]+) -> Capture Group 1: Key (alphanumeric, underscore, dot, slash)
            // ['"]? -> Optional quote
            // \s*[:=]\s* -> Separator (: or =) with optional whitespace
            // ([0-9.eE-]+) -> Capture Group 2: Value (number, scientific notation)
            const regex = /['"]?([a-zA-Z0-9_./]+)['"]?\s*[:=]\s*([0-9.eE-]+)/g;

            let match;
            let foundAny = false;

            while ((match = regex.exec(input)) !== null) {
                const key = match[1];
                const value = parseFloat(match[2]);
                if (!isNaN(value)) {
                    data[key] = value;
                    foundAny = true;
                }
            }

            if (!foundAny) {
                // If regex fails, try standard JSON parse as a fallback for strict formats
                try {
                    data = JSON.parse(input);
                } catch (e) {
                    // If both fail, just show nothing found
                }
            }

            setParsedData(data);
            setError(null);

            // Match keys to metrics
            const found = [];
            Object.entries(data).forEach(([key, value]) => {
                const lowerKey = key.toLowerCase();
                const matchedMetric = metrics.find(m =>
                    m.id === lowerKey || (m.aliases && m.aliases.includes(lowerKey))
                );

                if (matchedMetric) {
                    found.push({
                        key,
                        value,
                        metric: matchedMetric
                    });
                }
            });
            setDetectedMetrics(found);

        } catch (err) {
            // Silent fail on parsing, just show no metrics
            setParsedData(null);
            setDetectedMetrics([]);
        }
    }, [input]);

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Input Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <label className="font-black uppercase flex items-center gap-2 text-sm">
                            <Terminal className="w-4 h-4" />
                            Paste Training Log
                        </label>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-black rounded-lg opacity-20 group-focus-within:opacity-100 transition-opacity duration-200 blur-sm"></div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder={placeholders[placeholderIndex]}
                            className="relative w-full h-80 bg-black text-accent-cyan font-mono p-6 rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:shadow-[8px_8px_0px_0px_#FF0080] transition-all resize-none text-sm leading-relaxed placeholder:text-slate-500"
                            spellCheck="false"
                        />
                    </div>

                    <div className="flex items-center gap-3 text-sm font-bold">
                        <span className="text-text-muted uppercase text-xs">See examples:</span>
                        <button
                            onClick={() => setInput("{'loss': 1.2, 'accuracy': 0.65, 'learning_rate': 2e-5, 'epoch': 1.0, 'eval_loss': 1.1}")}
                            className="text-black hover:text-accent-pink hover:underline decoration-2 underline-offset-2 transition-colors"
                        >
                            LLM SFT
                        </button>
                        <span className="text-text-muted">/</span>
                        <button
                            onClick={() => setInput("{'loss': 0.0736, 'grad_norm': 1.39, 'learning_rate': 5e-06, 'rewards/mean': 0.72, 'entropy': 0.07, 'clip_ratio': 0.02, 'completions/mean_length': 747.2}")}
                            className="text-black hover:text-accent-pink hover:underline decoration-2 underline-offset-2 transition-colors"
                        >
                            GRPO RL
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="flex flex-col gap-4">
                    <label className="font-black uppercase flex items-center gap-2 text-sm">
                        <Search className="w-4 h-4" />
                        Analysis
                    </label>

                    {detectedMetrics.length > 0 ? (
                        <div className="flex flex-col gap-4 h-80 overflow-y-auto pr-2">
                            {detectedMetrics.map((item, index) => (
                                <Link
                                    key={index}
                                    to={`/metric/${item.metric.id}`}
                                    className="neo-card p-4 animate-in slide-in-from-bottom-4 duration-500 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-accent-yellow px-2 py-0.5 text-[10px] font-bold border border-black uppercase tracking-wider">
                                                    {item.key}
                                                </span>
                                                <ArrowRight className="w-3 h-3 text-text-muted" />
                                                <h3 className="text-lg font-black uppercase group-hover:underline decoration-2 underline-offset-2">
                                                    {item.metric.name}
                                                    {(() => {
                                                        // Extract prefix from key (eval_, train_, val_, validation_)
                                                        const lowerKey = item.key.toLowerCase();
                                                        const metricId = item.metric.id;
                                                        const prefixes = ['eval', 'train', 'val', 'validation'];

                                                        for (const prefix of prefixes) {
                                                            if (lowerKey.startsWith(prefix + '_') && lowerKey !== metricId) {
                                                                return <span className="text-sm font-bold text-accent-pink ml-1">({prefix})</span>;
                                                            }
                                                        }
                                                        return null;
                                                    })()}
                                                </h3>
                                            </div>
                                            <p className="text-text-muted font-medium text-xs">{item.metric.shortDescription}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-xl font-mono font-bold text-accent-pink">
                                                {typeof item.value === 'number'
                                                    ? (Math.abs(item.value) < 0.001 || Math.abs(item.value) >= 10000)
                                                        ? item.value.toExponential(2)
                                                        : item.value.toFixed(4)
                                                    : item.value
                                                }
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-black/60 group-hover:text-black transition-colors">
                                                <span>View Details</span>
                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </div>
                                        </div>
                                    </div>

                                    {item.metric.whatToLookFor && (
                                        <div className="mt-2 pt-2 border-t-2 border-dashed border-black/10">
                                            <ul className="space-y-1">
                                                {item.metric.whatToLookFor.slice(0, 2).map((tip, i) => (
                                                    <li key={i} className="text-xs flex items-start gap-2">
                                                        <span className="text-accent-emerald font-bold">›</span>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="h-80 border-2 border-dashed border-black/20 flex flex-col items-center justify-center text-text-muted p-8 text-center bg-white/50">
                            {input.trim() ? (
                                <>
                                    <AlertCircle className="w-10 h-10 mb-4 opacity-50" />
                                    <p className="font-bold">No familiar metrics found.</p>
                                    <p className="text-xs mt-2 max-w-xs">Try pasting a log containing 'loss', 'accuracy', 'reward', 'grad_norm', etc.</p>
                                </>
                            ) : (
                                <>
                                    <Terminal className="w-10 h-10 mb-4 opacity-50" />
                                    <p className="font-bold">Waiting for input...</p>
                                    <p className="text-xs mt-2">Paste your training log on the left to get started.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogAnalyzer;
