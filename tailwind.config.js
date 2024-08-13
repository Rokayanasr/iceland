/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
    theme: {
        extend: {},
        colors: {
            whity: "#FBF8F3",
            texty: "#6B705C",
            primary: "#5E604B",
            primaryLight: "#ddddd2",
            primaryHover: "#8c8a6e",
            secondary: "#D3B89D",
            secondaryDark: "#B6977A",
        },
    },
    plugins: [flowbite.plugin()],
};
