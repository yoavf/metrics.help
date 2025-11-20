import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Github, Info, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

const Sidebar = ({ metrics, algorithms, onShowCredits, isCollapsed, onToggleCollapse }) => {
    const location = useLocation();
    const [openSection, setOpenSection] = React.useState('algorithms');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const SidebarContent = ({ isMobile = false }) => (
        <>
            <div className="p-6 border-b-2 border-black">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-accent-yellow border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 transition-transform flex-shrink-0">
                        <Activity className="text-black w-6 h-6" />
                    </div>
                    {(!isCollapsed || isMobile) && <span className="font-black text-xl tracking-tighter whitespace-nowrap">metrics.help</span>}
                </Link>
            </div>

            {(!isCollapsed || isMobile) && (
                <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
                    {/* Metrics Section */}
                    <div>
                        <button
                            onClick={() => toggleSection('metrics')}
                            className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest mb-2 pl-4 py-3 text-text-muted hover:text-black transition-colors hover:bg-black/5 cursor-pointer"
                        >
                            <span>Metrics</span>
                            <span className={`transform transition-transform ${openSection === 'metrics' ? 'rotate-90' : ''}`}>▶</span>
                        </button>

                        {openSection === 'metrics' && (
                            <div className="animate-in slide-in-from-top-2 duration-200">
                                {metrics.map(metric => {
                                    const isActive = location.pathname === `/metric/${metric.id}`;
                                    return (
                                        <Link
                                            key={metric.id}
                                            to={`/metric/${metric.id}`}
                                            className={`px-4 py-3 font-bold border-2 transition-all duration-200 flex items-center gap-3 mb-2 ${isActive
                                                ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(139,92,246,0)] translate-x-1'
                                                : 'bg-transparent border-transparent text-text-muted hover:bg-accent-yellow hover:text-black hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                                }`}
                                        >
                                            {isActive && <span className="text-accent-pink">●</span>}
                                            {metric.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Algorithms Section */}
                    <div className="mt-4">
                        <button
                            onClick={() => toggleSection('algorithms')}
                            className="w-full flex items-center justify-between text-xs font-black uppercase tracking-widest mb-2 pl-4 py-3 text-text-muted hover:text-black transition-colors hover:bg-black/5 cursor-pointer"
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
                                            className={`px-4 py-3 font-bold border-2 transition-all duration-200 flex items-center gap-3 mb-2 ${isActive
                                                ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(139,92,246,0)] translate-x-1'
                                                : 'bg-transparent border-transparent text-text-muted hover:bg-accent-pink hover:text-black hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
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
                </nav>
            )}

            <div className={`p-4 border-t-2 border-black bg-bg flex flex-col gap-2 ${isCollapsed && !isMobile ? 'items-center' : ''}`}>
                {isCollapsed && !isMobile ? (
                    <>
                        <button
                            onClick={onShowCredits}
                            className="p-3 border-2 border-black bg-white hover:bg-accent-yellow hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                            title="Credits"
                        >
                            <Info size={18} />
                        </button>
                    </>
                ) : (
                    <>
                        <a href="https://github.com/yoavf/metrics.help" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm font-bold border-2 border-black bg-white p-3 hover:bg-accent-cyan hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <Github size={18} />
                            <span>Open Source</span>
                        </a>
                        <button
                            onClick={onShowCredits}
                            className="flex items-center justify-center gap-2 text-sm font-bold border-2 border-black bg-white p-3 hover:bg-accent-yellow hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            <Info size={18} />
                            <span>Credits</span>
                        </button>
                    </>
                )}
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden fixed top-4 right-4 z-50 bg-accent-yellow border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
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
            <aside className={`md:hidden flex flex-col fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-surface border-r-2 border-black z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-black/5 transition-colors"
                    aria-label="Close menu"
                >
                    <X className="w-6 h-6" />
                </button>
                <SidebarContent isMobile={true} />
            </aside>

            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex flex-col fixed h-full bg-surface border-r-2 border-black z-10 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
                {/* Collapse/Expand Button */}
                <button
                    onClick={() => onToggleCollapse(!isCollapsed)}
                    className="absolute -right-3 top-24 bg-accent-yellow border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 transition-all z-20"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>

                <SidebarContent />
            </aside>
        </>
    );
};

export default Sidebar;
