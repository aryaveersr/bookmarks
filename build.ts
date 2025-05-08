import { Glob } from "bun";
import { join } from "path";

await Bun.build({
  entrypoints: ["src/index.html"],
  outdir: "dist",
  sourcemap: "linked",
  minify: true,
  naming: {
    chunk: "[dir]/[name].[ext]",
    asset: "[dir]/[name].[ext]",
  },
});

const files = await Array.fromAsync(new Glob("assets/*").scan("src"));

files.push("googlee7932333831ee963.html");
files.push("favicon.ico");

files.forEach((file) => {
  Bun.write(join("dist", file), Bun.file(join("src", file)));
});
