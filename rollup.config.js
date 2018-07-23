import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs"
  },
  external: ["react", "react-dom"],
  plugins: [
    resolve(),
    babel({
      exclude: "node_modules/**",
      plugins: ["external-helpers"]
    }),
    commonjs({
      include: [
        //some react related modules i need
        "node_modules/react-node-resolver/**"
      ]
    })
  ]
};
