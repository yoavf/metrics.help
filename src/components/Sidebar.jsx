import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, ChevronLeft, ChevronRight, Menu, X, Search } from 'lucide-react';

const Sidebar = ({ metrics, algorithms, isCollapsed, onToggleCollapse }) => {
    const location = useLocation();
    const [openSection, setOpenSection] = React.useState('metrics');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const searchInputRef = React.useRef(null);

    // Auto-expand section based on URL
    React.useEffect(() => {
        if (location.pathname.includes('/metric/')) {
            setOpenSection('metrics');
        } else if (location.pathname.includes('/algorithm/')) {
            setOpenSection('algorithms');
        }
    }, [location.pathname]);

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Refocus search input after filtering updates
    React.useEffect(() => {
        if (searchQuery && searchInputRef.current && document.activeElement !== searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchQuery]);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Filter metrics and algorithms based on search
    const filterItems = (items, query) => {
        if (!query.trim()) return items;
        const lowerQuery = query.toLowerCase();
        return items.filter(item =>
            item.name.toLowerCase().includes(lowerQuery) ||
            item.id.toLowerCase().includes(lowerQuery) ||
            (item.aliases && item.aliases.some(alias => alias.toLowerCase().includes(lowerQuery)))
        );
    };

    const filteredMetrics = filterItems(metrics, searchQuery);
    const filteredAlgorithms = filterItems(algorithms, searchQuery);
    const isSearching = searchQuery.trim().length > 0;

    // Organize metrics into parents and children
    const parentMetrics = metrics.filter(m => !m.parent);
    const childMetricsByParent = metrics
        .filter(m => m.parent)
        .reduce((acc, m) => {
            if (!acc[m.parent]) acc[m.parent] = [];
            acc[m.parent].push(m);
            return acc;
        }, {});

    // Sort children to put "Standard" first
    Object.keys(childMetricsByParent).forEach(parentId => {
        childMetricsByParent[parentId].sort((a, b) => {
            if (a.id.endsWith('-standard')) return -1;
            if (b.id.endsWith('-standard')) return 1;
            return 0;
        });
    });

    const renderHeader = (isMobile) => (
        <div className="p-6 border-b border-black/10">
            <Link to="/" className="flex items-center gap-3 group">
                <div className="bg-accent-yellow border border-black/10 p-2 shadow-sm  transition-transform flex-shrink-0">
                    <Activity className="text-black w-6 h-6" />
                </div>
                {(!isCollapsed || isMobile) && <span className="font-bold text-xl tracking-tight whitespace-nowrap">metrics.help</span>}
            </Link>
        </div>
    );

    const renderNav = () => (
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
            {/* Search Input */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 border border-black/10 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent-yellow focus:border-black placeholder:text-text-muted"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-text-muted hover:text-black transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
            {/* When searching, show flat list of results */}
            {isSearching ? (
                <div className="animate-in fade-in duration-200">
                    {filteredMetrics.map(metric => {
                        const isActive = location.pathname === `/metric/${metric.id}`;
                        return (
                            <Link
                                key={metric.id}
                                to={`/metric/${metric.id}`}
                                className={`px-4 py-2.5 font-semibold rounded-lg border transition-all duration-200 flex items-center gap-3 mb-2 ${isActive
                                    ? 'bg-black text-white border-black shadow-sm '
                                    : 'bg-transparent border-transparent text-text-muted hover:bg-accent-yellow hover:text-black hover:border-black/10 hover:shadow-sm'
                                    }`}
                            >
                                {isActive && <span className="text-accent-pink">●</span>}
                                {metric.name}
                            </Link>
                        );
                    })}
                    {filteredAlgorithms.map(algo => {
                        const isActive = location.pathname === `/algorithm/${algo.id}`;
                        return (
                            <Link
                                key={algo.id}
                                to={`/algorithm/${algo.id}`}
                                className={`px-4 py-2.5 font-semibold rounded-lg border transition-all duration-200 flex items-center gap-3 mb-2 ${isActive
                                    ? 'bg-black text-white border-black shadow-sm '
                                    : 'bg-transparent border-transparent text-text-muted hover:bg-accent-pink hover:text-black hover:border-black/10 hover:shadow-sm'
                                    }`}
                            >
                                {isActive && <span className="text-accent-yellow">●</span>}
                                {algo.name}
                            </Link>
                        );
                    })}
                    {filteredMetrics.length === 0 && filteredAlgorithms.length === 0 && (
                        <p className="text-text-muted text-sm px-4 py-2">No results found</p>
                    )}
                </div>
            ) : (
                <>
                    {/* Metrics Section */}
                    <div>
                        <button
                            onClick={() => toggleSection('metrics')}
                            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-2 pl-4 py-3 text-text-muted hover:text-black transition-colors hover:bg-black/5 cursor-pointer"
                        >
                            <span>Metrics</span>
                            <span className={`transform transition-transform ${openSection === 'metrics' ? 'rotate-90' : ''}`}>▶</span>
                        </button>

                        {openSection === 'metrics' && (
                            <div className="animate-in slide-in-from-top-2 duration-200">
                                {parentMetrics.map(metric => {
                                    const isActive = location.pathname === `/metric/${metric.id}`;
                                    const children = childMetricsByParent[metric.id] || [];
                                    const hasActiveChild = children.some(c => location.pathname === `/metric/${c.id}`);
                                    return (
                                        <div key={metric.id}>
                                            <Link
                                                to={`/metric/${metric.id}`}
                                                className={`px-4 py-2.5 font-semibold rounded-lg border transition-all duration-200 flex items-center gap-3 mb-1 ${isActive
                                                    ? 'bg-black text-white border-black shadow-sm '
                                                    : 'bg-transparent border-transparent text-text-muted hover:bg-accent-yellow hover:text-black hover:border-black/10 hover:shadow-sm'
                                                    }`}
                                            >
                                                {(isActive || hasActiveChild) && <span className="text-accent-pink">●</span>}
                                                {metric.name}
                                            </Link>
                                            {children.length > 0 && (
                                                <div className="ml-6 mb-2">
                                                    {children.map(child => {
                                                        const isChildActive = location.pathname === `/metric/${child.id}`;
                                                        // Extract just the variant name (e.g., "SFT" from "Loss (SFT)")
                                                        const variantName = child.name.match(/\(([^)]+)\)/)?.[1] || child.name;
                                                        return (
                                                            <Link
                                                                key={child.id}
                                                                to={`/metric/${child.id}`}
                                                                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 flex items-center gap-2 mb-1 ${isChildActive
                                                                    ? 'bg-black text-white border-black'
                                                                    : 'bg-transparent border-transparent text-text-muted hover:bg-accent-yellow/50 hover:text-black hover:border-black/10'
                                                                    }`}
                                                            >
                                                                {isChildActive && <span className="text-accent-pink">●</span>}
                                                                {variantName}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Algorithms Section */}
                    <div className="mt-4">
                        <button
                            onClick={() => toggleSection('algorithms')}
                            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest mb-2 pl-4 py-3 text-text-muted hover:text-black transition-colors hover:bg-black/5 cursor-pointer"
                        >
                            <span>Algorithms</span>
                            <span className={`transform transition-transform ${openSection === 'algorithms' ? 'rotate-90' : ''}`}>▶</span>
                        </button>

                        {openSection === 'algorithms' && (
                            <div className="animate-in slide-in-from-top-2 duration-200">
                                {algorithms.map(algo => {
                                    const isActive = location.pathname === `/algorithm/${algo.id}`;
                                    return (
                                        <Link
                                            key={algo.id}
                                            to={`/algorithm/${algo.id}`}
                                            className={`px-4 py-2.5 font-semibold rounded-lg border transition-all duration-200 flex items-center gap-3 mb-2 ${isActive
                                                ? 'bg-black text-white border-black shadow-sm '
                                                : 'bg-transparent border-transparent text-text-muted hover:bg-accent-pink hover:text-black hover:border-black/10 hover:shadow-sm'
                                                }`}
                                        >
                                            {isActive && <span className="text-accent-yellow">●</span>}
                                            {algo.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </nav>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden fixed top-4 right-4 z-50 bg-accent-yellow border border-black/10 p-3 shadow-sm hover:shadow-sm active:shadow-none transition-all"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6 text-black" />
            </button>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer */}
            <aside className={`md:hidden flex flex-col fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-surface border-r border-black/10 z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-black/5 transition-colors"
                    aria-label="Close menu"
                >
                    <X className="w-6 h-6" />
                </button>
                {renderHeader(true)}
                {renderNav()}
            </aside>

            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex flex-col fixed h-full bg-surface border-r border-black/10 z-10 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
                {/* Collapse/Expand Button */}
                <button
                    onClick={() => onToggleCollapse(!isCollapsed)}
                    className="absolute -right-3 top-20 bg-accent-yellow border border-black/10 p-1 shadow-sm hover:shadow-sm  transition-all z-20"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>

                {renderHeader(false)}
                {!isCollapsed && renderNav()}
            </aside>
        </>
    );
};

export default Sidebar;
