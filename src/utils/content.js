import yaml from 'js-yaml';

const parseMarkdown = (markdown, index) => {
    // console.log(`Parsing file ${index}, length: ${markdown?.length}`);
    if (!markdown) {
        console.error(`File ${index} is empty or undefined`);
        return {
            id: `error-empty-${index}`,
            name: 'Error: Empty File',
            description: 'File content is empty'
        };
    }

    const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
        console.warn(`File ${index} regex mismatch. Content start: ${markdown.substring(0, 50)}...`);
        return {
            id: `error-regex-${index}`,
            name: 'Error: Format Mismatch',
            description: markdown.trim()
        };
    }

    const frontmatter = match[1];
    const body = match[2];

    try {
        const data = yaml.load(frontmatter);
        return {
            ...data,
            description: body.trim()
        };
    } catch (e) {
        console.error(`YAML parse error in file ${index}:`, e);
        return {
            id: `error-yaml-${index}`,
            name: 'Error: YAML Parse',
            description: body.trim(),
            error: 'Failed to parse frontmatter'
        };
    }
};

export const getMetrics = () => {
    const modules = import.meta.glob('../content/metrics/*.md', { eager: true, query: '?raw', import: 'default' });
    console.log('Loaded metrics modules:', Object.keys(modules).length);

    return Object.values(modules).map((content, index) => parseMarkdown(content, index));
};

export const getAlgorithms = () => {
    const modules = import.meta.glob('../content/algorithms/*.md', { eager: true, query: '?raw', import: 'default' });
    console.log('Loaded algorithms modules:', Object.keys(modules).length);

    return Object.values(modules).map((content, index) => parseMarkdown(content, index));
};
