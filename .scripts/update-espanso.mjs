// Users/chance.smith/.kenv/kenvs/shared-kenv/scripts/update-espanso.ts
import "@johnlindquist/kit";
await exec(
  "espanso install lw-snippets --git git@github.com:LifewayIT/lw-snippets.git --external --force"
);
