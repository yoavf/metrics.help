import React from 'react';

const ReviewedNote = ({ date }) => {
    if (!date) return null;
    return (
        <p className="relative z-10 mt-6 text-xs font-bold opacity-70">
            Last reviewed {date} against the{' '}
            <a href="https://huggingface.co/docs/trl" target="_blank" rel="noreferrer" className="underline">TRL</a>
            {' '}and{' '}
            <a href="https://huggingface.co/docs/transformers/main_classes/trainer" target="_blank" rel="noreferrer" className="underline">Transformers Trainer</a>
            {' '}docs. Field names and defaults can change between library versions.
        </p>
    );
};

export default ReviewedNote;
