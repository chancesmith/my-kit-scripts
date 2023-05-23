// .kenv/kenvs/shared-kenv/scripts/open-recent-vs-code-project.ts
import "@johnlindquist/kit";
import { URL, fileURLToPath } from "url";
var filename = home("Library", "Application Support", "Code", "User", "globalStorage", "state.vscdb");
if (isWin)
  filename = home("AppData", "Roaming", "Code", "User", "globalStorage", "state.vscdb");
var { default: sqlite3 } = await import("sqlite3");
var { open } = await import("sqlite");
var db = await open({
  filename,
  driver: sqlite3.Database
});
var key = `history.recentlyOpenedPathsList`;
var table = `ItemTable`;
var result = await db.get(`SELECT * FROM ${table} WHERE key = '${key}'`);
var recentPaths = JSON.parse(result.value);
recentPaths = recentPaths.entries.map((e) => e?.folderUri).filter(Boolean).map((uri) => fileURLToPath(new URL(uri)));
var recentPath = await arg("Open a recent path", recentPaths);
hide();
await exec(`code ${recentPath}`);
