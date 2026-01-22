import { build as viteBuild } from "vite";
import { rm } from "fs/promises";

async function buildForVercel() {
  await rm("dist", { recursive: true, force: true });

  console.log("Building client for Vercel...");
  await viteBuild();
  
  console.log("Build complete! Output in dist/public");
}

buildForVercel().catch((err) => {
  console.error(err);
  process.exit(1);
});
