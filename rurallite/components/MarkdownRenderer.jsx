"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content, showLogs = false }) {
    // Ensure content is a string and clean it thoroughly
    let cleanContent = typeof content === 'string' ? content : '';

    // Remove leading whitespace and any leading commas/special chars
    cleanContent = cleanContent.trim().replace(/^[,\s]+/, '');

    if (!cleanContent) {
        return (
            <div className="text-slate-500 italic p-4">
                No content available for this lesson.
            </div>
        );
    }

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ node, ...props }) => {
                    if (showLogs) console.log("🟢 [Markdown H1]:", props.children);
                    return (
                        <h1
                            className="text-3xl sm:text-4xl font-black text-orange-900 mb-6 mt-8"
                            id={props.children
                                ?.toString()
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "")}
                            {...props}
                        />
                    );
                },
                h2: ({ node, ...props }) => {
                    if (showLogs) console.log("🟡 [Markdown H2]:", props.children);
                    return (
                        <h2
                            className="text-2xl sm:text-3xl font-bold text-orange-800 mb-4 mt-6 border-b-2 border-orange-200 pb-2"
                            id={props.children
                                ?.toString()
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "")}
                            {...props}
                        />
                    );
                },
                h3: ({ node, ...props }) => (
                    <h3
                        className="text-xl sm:text-2xl font-semibold text-orange-700 mb-3 mt-5"
                        id={props.children
                            ?.toString()
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "")}
                        {...props}
                    />
                ),
                p: ({ node, ...props }) => (
                    <p className="text-slate-700 leading-relaxed mb-4" {...props} />
                ),
                ul: ({ node, ...props }) => (
                    <ul
                        className="list-disc list-inside text-slate-700 my-4 space-y-2 pl-4"
                        {...props}
                    />
                ),
                ol: ({ node, ...props }) => (
                    <ol
                        className="list-decimal list-inside text-slate-700 my-4 space-y-2 pl-4"
                        {...props}
                    />
                ),
                li: ({ node, ...props }) => (
                    <li className="text-slate-700 my-2" {...props} />
                ),
                strong: ({ node, ...props }) => (
                    <strong className="font-bold text-orange-700" {...props} />
                ),
                code: ({ node, inline, ...props }) =>
                    inline ? (
                        <code
                            className="bg-beige-100 text-orange-700 px-2 py-1 rounded text-sm font-mono"
                            {...props}
                        />
                    ) : (
                        <code
                            className="block bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto my-4 font-mono text-sm"
                            {...props}
                        />
                    ),
                blockquote: ({ node, ...props }) => (
                    <blockquote
                        className="border-l-4 border-orange-500 bg-orange-50 p-4 italic my-4 text-slate-600"
                        {...props}
                    />
                ),
                a: ({ node, ...props }) => (
                    <a
                        className="text-orange-600 hover:underline font-medium"
                        {...props}
                    />
                ),
                hr: ({ node, ...props }) => (
                    <hr className="border-t-2 border-orange-200 my-8" {...props} />
                ),
                table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-6">
                        {" "}
                        <table
                            className="min-w-full border-collapse border border-gray-300"
                            {...props}
                        />{" "}
                    </div>
                ),
                th: ({ node, ...props }) => (
                    <th
                        className="bg-orange-100 p-3 text-left font-semibold text-slate-800 border border-gray-300"
                        {...props}
                    />
                ),
                td: ({ node, ...props }) => (
                    <td
                        className="p-3 text-slate-700 border border-gray-300"
                        {...props}
                    />
                ),
            }}
        >
            {cleanContent}
        </ReactMarkdown>
    );
}
