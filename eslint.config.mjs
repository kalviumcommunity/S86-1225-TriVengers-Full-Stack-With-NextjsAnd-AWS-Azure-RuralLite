export default [
    {
        ignores: [
            '**/node_modules/**',
            '**/.next/**',
            '**/out/**',
            '**/build/**',
            '**/dist/**',
            '**/.git/**',
            '**/coverage/**',
            '**/*.config.js',
            '**/*.config.mjs',
        ],
    },
    {
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
        rules: {
            // Add your rules here or leave empty to use defaults
        },
    },
];
