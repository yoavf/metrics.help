import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const linkClass = 'text-[#111] no-underline cursor-pointer bg-transparent border-0 p-0 italic [transition:color_.18s_ease] hover:text-[#FF0080] focus-visible:text-[#FF0080] active:text-[#c90067] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#111] focus-visible:outline-offset-[3px]';
const Dot = () => <span className="not-italic opacity-65">·</span>;

const SiteFooter = ({ onShowCredits }) => {
    const { pathname } = useLocation();

    return (
        <footer className="bg-[#FFDE00] text-[#111] border-t border-[#d2b900] px-4">
            <nav
                aria-label="Footer"
                className="flex items-center justify-center gap-[7px] py-[13px] px-1 font-[Georgia,'Times_New_Roman',serif] text-[12px] italic leading-[1.2] whitespace-nowrap"
            >
                <a href="https://github.com/yoavf/metrics.help" target="_blank" rel="noopener noreferrer" className={linkClass}>Open Source</a>
                <Dot />
                <button type="button" onClick={onShowCredits} className={linkClass}>Credits</button>
                <Dot />
                <Link to="/changelog" className={`${linkClass} ${pathname === '/changelog' ? 'font-bold' : ''}`}>Changelog</Link>
            </nav>
        </footer>
    );
};

export default SiteFooter;
