// Name: Open Recent VS Code Project

import "@johnlindquist/kit"
import { URL, fileURLToPath } from "url"

// /Users/johnlindquist/Library/Application Support/Code/User/globalStorage/state.vscdb
let filename = home("Library", "Application Support", "Code", "User", "globalStorage", "state.vscdb")
// windows path not tested, just guessing
if (isWin) filename = home("AppData", "Roaming", "Code", "User", "globalStorage", "state.vscdb")
let { default: sqlite3 } = await import("sqlite3")
let { open } = await import("sqlite")

const db = await open({
  filename,
  driver: sqlite3.Database,
})

let key = `history.recentlyOpenedPathsList`
let table = `ItemTable`

let result = await db.get(`SELECT * FROM ${table} WHERE key = '${key}'`)
let recentPaths = JSON.parse(result.value)
recentPaths = recentPaths.entries
  .map(e => e?.folderUri)
  .filter(Boolean)
  .map(uri => fileURLToPath(new URL(uri)))

let recentPath = await arg("Open a recent path", recentPaths)
hide()
await exec(`code ${recentPath}`)
