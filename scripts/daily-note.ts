// Name: daily note
// Description: Open today's daily note in obsidian

// You must install the Actions URI plugin and have the daily notes plugin enabled
// Currently MacOS only

import "@johnlindquist/kit"
import { homedir } from "os"
import { join as joinPath } from "path"

const VAULT_NAME = await env(
  "VAULT_NAME",
  async () => {
    const vaultNames = await getVaultNames().catch(() => [])
    if (vaultNames.length === 1) {
      return vaultNames[0]
    } else {
      return await arg(
        "Which vault do you want to use?",
        vaultNames
      )
    }
  }
);

const CREATE_URI = `obsidian://actions-uri/daily-note/create?vault=${VAULT_NAME}&silent=true`
const OPEN_URI = `obsidian://actions-uri/daily-note/open-current?vault=${VAULT_NAME}`

await applescript(`
  tell application "Obsidian"
    open location "${CREATE_URI}"
    open location "${OPEN_URI}"
    activate
  end tell
`);

async function getVaultNames() {
  const obsidianConfPath = joinPath(homedir(), "Library/Application Support/obsidian/obsidian.json")

  // {"vaults":{"9aeaa3aaa2ad0602":{"path":"/Users/human/Documents/Obsidian Vault","ts":1651412412801,"open":true}}}
  const obsidianConf = JSON.parse(await (await readFile(obsidianConfPath)).toString())
  const vaults = obsidianConf.vaults
  const vaultNames = Object.keys(vaults).map((vaultId) => vaults[vaultId].path.split("/").pop())
  return vaultNames
}
