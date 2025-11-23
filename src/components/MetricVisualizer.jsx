import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-bold uppercase mb-1">{`Step ${label}`}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="font-mono" style={{ color: entry.color }}>
                        {`${entry.name}: ${entry.value.toFixed(3)}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const MetricVisualizer = ({ metric }) => {
    const [mode, setMode] = useState('healthy');
    // State for sub-scenario selection
    const [healthyScenario, setHealthyScenario] = useState(null);
    const [unhealthyScenario, setUnhealthyScenario] = useState(null);

    // Early return if visualizations data is missing or malformed
    if (!metric?.visualizations) {
        return null;
    }

    // Determine if data has multiple scenarios
    const healthyData = metric.visualizations.healthy;
    const unhealthyData = metric.visualizations.unhealthy;
    const hasMultipleHealthy = healthyData && !Array.isArray(healthyData.data) && !healthyData.data;
    const hasMultipleUnhealthy = unhealthyData && !Array.isArray(unhealthyData.data) && !unhealthyData.data;

    // Initialize scenarios when metric changes
    React.useEffect(() => {
        if (hasMultipleHealthy) {
            setHealthyScenario(Object.keys(healthyData)[0]);
        } else {
            setHealthyScenario(null);
        }
        if (hasMultipleUnhealthy) {
            setUnhealthyScenario(Object.keys(unhealthyData)[0]);
        } else {
            setUnhealthyScenario(null);
        }
    }, [metric, hasMultipleHealthy, hasMultipleUnhealthy]);

    // Get current display data with defensive checks for stale scenario state
    let currentData, currentAnalysis;

    if (mode === 'healthy') {
        if (hasMultipleHealthy && healthyScenario && healthyData[healthyScenario]) {
            currentData = healthyData[healthyScenario].data;
            currentAnalysis = healthyData[healthyScenario].analysis;
        } else if (hasMultipleHealthy) {
            // Fallback to first scenario if current scenario is stale
            const firstKey = Object.keys(healthyData)[0];
            currentData = healthyData[firstKey]?.data;
            currentAnalysis = healthyData[firstKey]?.analysis;
        } else if (healthyData) {
            currentData = healthyData.data;
            currentAnalysis = healthyData.analysis;
        }
    } else {
        if (hasMultipleUnhealthy && unhealthyScenario && unhealthyData[unhealthyScenario]) {
            currentData = unhealthyData[unhealthyScenario].data;
            currentAnalysis = unhealthyData[unhealthyScenario].analysis;
        } else if (hasMultipleUnhealthy) {
            // Fallback to first scenario if current scenario is stale
            const firstKey = Object.keys(unhealthyData)[0];
            currentData = unhealthyData[firstKey]?.data;
            currentAnalysis = unhealthyData[firstKey]?.analysis;
        } else if (unhealthyData) {
            currentData = unhealthyData.data;
            currentAnalysis = unhealthyData.analysis;
        }
    }

    // Determine accent color based on metric type for the "active" feel
    const accentColor = metric.id === 'accuracy' || metric.id === 'recall' ? '#FF0080' : '#00FFFF';

    return (
        <div className="neo-card p-6 md:p-8 bg-surface">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h3 className="text-2xl font-black uppercase">
                        Live Visualization
                    </h3>
                    <p className="text-text-muted font-medium mt-1">
                        Toggle between healthy and unhealthy patterns
                    </p>
                </div>

                <div className="flex p-1 bg-bg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <button
                        onClick={() => setMode('healthy')}
                        className={`px-6 py-2 font-bold uppercase text-sm transition-all ${mode === 'healthy'
                            ? 'bg-accent-green text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                            : 'text-text-muted hover:bg-white/50'
                            }`}
                    >
                        Healthy
                    </button>
                    <button
                        onClick={() => setMode('unhealthy')}
                        className={`px-6 py-2 font-bold uppercase text-sm transition-all ${mode === 'unhealthy'
                            ? 'bg-accent-pink text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                            : 'text-text-muted hover:bg-white/50'
                            }`}
                    >
                        Unhealthy
                    </button>
                </div>
            </div>

            {/* Sub-scenario Selector - left aligned above graph */}
            {mode === 'healthy' && hasMultipleHealthy && (
                <div className="flex flex-wrap gap-2 mb-4 animate-in slide-in-from-top-1">
                    {Object.entries(healthyData).map(([key, scenario]) => (
                        <button
                            key={key}
                            onClick={() => setHealthyScenario(key)}
                            className={`px-3 py-1 text-xs font-bold uppercase border-2 border-black transition-all ${healthyScenario === key
                                ? 'bg-black text-white shadow-[2px_2px_0px_0px_#00FF00]'
                                : 'bg-white text-black hover:bg-gray-100'
                                }`}
                        >
                            {scenario.label || key}
                        </button>
                    ))}
                </div>
            )}
            {mode === 'unhealthy' && hasMultipleUnhealthy && (
                <div className="flex flex-wrap gap-2 mb-4 animate-in slide-in-from-top-1">
                    {Object.entries(unhealthyData).map(([key, scenario]) => (
                        <button
                            key={key}
                            onClick={() => setUnhealthyScenario(key)}
                            className={`px-3 py-1 text-xs font-bold uppercase border-2 border-black transition-all ${unhealthyScenario === key
                                ? 'bg-black text-white shadow-[2px_2px_0px_0px_#FFDE00]'
                                : 'bg-white text-black hover:bg-gray-100'
                                }`}
                        >
                            {scenario.label || key}
                        </button>
                    ))}
                </div>
            )}

            <div className="h-[250px] w-full border-2 border-black bg-bg p-4 relative">
                {/* Grid Pattern Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={currentData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                        <XAxis
                            dataKey="step"
                            stroke="#000"
                            tick={{ fill: '#000', fontSize: 12, fontWeight: 'bold' }}
                            tickLine={{ stroke: '#000' }}
                            axisLine={{ stroke: '#000', strokeWidth: 2 }}
                        />
                        <YAxis
                            stroke="#000"
                            tick={{ fill: '#000', fontSize: 12, fontWeight: 'bold' }}
                            tickLine={{ stroke: '#000' }}
                            axisLine={{ stroke: '#000', strokeWidth: 2 }}
                            domain={metric.visualizations.yDomain || ['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        {(() => {
                            // Detect if data has multiple value keys (e.g., train/val) or just "value"
                            if (!currentData || currentData.length === 0) return null;

                            const dataKeys = Object.keys(currentData[0]).filter(key => key !== 'step');
                            const hasMultipleLines = !dataKeys.includes('value') && dataKeys.length > 1;

                            // Color schemes for multiple lines
                            const lineColors = {
                                value: '#000',
                                train: '#00FFFF',  // cyan for training
                                val: '#FF0080',    // pink for validation
                                chosen: '#00FF00', // green
                                rejected: '#FF0000' // red
                            };

                            if (dataKeys.includes('value')) {
                                // Single line with "value" key
                                return (
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#000"
                                        strokeWidth={4}
                                        dot={{ r: 6, fill: '#000', strokeWidth: 0 }}
                                        activeDot={{ r: 8, fill: accentColor, stroke: '#000', strokeWidth: 2 }}
                                        animationDuration={1500}
                                    />
                                );
                            } else {
                                // Multiple lines (e.g., train/val)
                                return (
                                    <>
                                        {hasMultipleLines && (
                                            <Legend
                                                wrapperStyle={{
                                                    paddingTop: '10px',
                                                    fontWeight: 'bold',
                                                    fontSize: '12px',
                                                    textTransform: 'uppercase'
                                                }}
                                            />
                                        )}
                                        {dataKeys.map((key, index) => (
                                            <Line
                                                key={key}
                                                type="monotone"
                                                dataKey={key}
                                                name={key.charAt(0).toUpperCase() + key.slice(1)}
                                                stroke={lineColors[key] || '#000'}
                                                strokeWidth={4}
                                                dot={{ r: 6, fill: lineColors[key] || '#000', strokeWidth: 2, stroke: '#000' }}
                                                activeDot={{ r: 8, fill: lineColors[key] || '#000', stroke: '#000', strokeWidth: 2 }}
                                                animationDuration={1500}
                                            />
                                        ))}
                                    </>
                                );
                            }
                        })()}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex items-start gap-4 p-4 bg-accent-yellow/20 border-2 border-black border-dashed">
                <Info className="w-6 h-6 text-black flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-black uppercase text-sm mb-1">Analysis</h4>
                    <p className="text-sm font-medium leading-relaxed">
                        {currentAnalysis}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MetricVisualizer;
