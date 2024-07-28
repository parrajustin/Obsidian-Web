import * as esbuild from "esbuild";
import * as fs from "fs";

const result = await esbuild.build({
  entryPoints: ["client/index.ts"],
  bundle: true,
  minify: false,
  sourcemap: "linked",
  platform: "browser",
  target: ["chrome128"],
  metafile: true,
  treeShaking: true,
  outdir: "public"
});
console.log(result);

fs.writeFile("public/meta.json", JSON.stringify(result.metafile, undefined, 2), (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Success!");
  }
});
