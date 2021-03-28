import typescript from "rollup-plugin-typescript2";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import json from "rollup-plugin-json";
import {terser} from "rollup-plugin-terser";

const pkg = require("./package.json");

let config = {
    input: "src/index.ts",
    output: {
        name: pkg.name,
        format: "umd",
        file: "dist/" + pkg.name + ".min.js",
        globals: {
            d3: "d3"
        },
        plugins: [terser()],
    },
    external: ["d3"],
    plugins: [
        json(),
        typescript(),
    ]
};

if (process.env.BUILD === "production") {
    config.output.banner = `/**
 * @module ${pkg.name}
 * @version ${pkg.version}
*/`;
} else {
    config.plugins = config.plugins.concat([
        serve({
            open: true,
            contentBase: ""
        }),
        livereload()
    ]);
}

export default config;
