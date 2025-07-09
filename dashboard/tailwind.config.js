/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#E7CCCC',
                secondary: '#EDE8DC',
                tertiary: '#A5B68D',
                quaternary: '#C1CFA1',
                muted: '#808080',
                dark: '#333333',
                light: '#F5F5F5',
                white: '#FFFFFF',
                black: '#000000',
                error: '#FF0000',
                success: '#00FF00',
            },
            fontFamily: {
                saira: ['Saira', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
