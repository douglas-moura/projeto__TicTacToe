/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    	"index.html",
    	"./src/**/*.{html,js}"
    ],
    theme: {
        extend: {
        	width: {
        		'120': '120%'
        	}
        }
    },
    plugins: []
};
