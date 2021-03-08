module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        mocha: true,
    },
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'quotes': ['error', 'single'],
        'no-console': 'error',
        'semi': ['error', 'never'],
        '@typescript-eslint/semi': ['error', 'never'],
        '@typescript-eslint/no-empty-interface': [
            'error',
            {'allowSingleExtends': true},
        ],
    }
}