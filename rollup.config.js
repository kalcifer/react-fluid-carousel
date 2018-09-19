import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "src/index.js",
  output: [{
    file: "dist/bundle.cjs.js",
    format: "cjs",
    exports: "default",
    sourcemap: true
  }, {
    file: "dist/bundle.js",
    format: "es",
    exports: "named",
    sourcemap: true
  }, {
    file: "dist/bundle.umd.js",
    format: "umd",
    exports: "default",
    name: "ReactFluidCarousel",
    sourcemap: true,
    globals: {
      react: "React",
      "react-dom": "ReactDOM"
    }
  }],
  external: ["react", "react-dom"],
  plugins: [
    resolve({
      jsnext: true,
      browser: true,
      main: true
    }),
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
