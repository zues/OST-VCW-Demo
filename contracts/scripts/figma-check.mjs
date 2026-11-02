// Erzeugt ein Prüfscript für die Figma-Seite der Contracts.
//
//   node contracts/scripts/figma-check.mjs > /tmp/figma-check.js
//
// Den Inhalt der Ausgabe im figma-console MCP mit `figma_execute` ausführen (Figma-File „OST“,
// Desktop Bridge verbunden). Geprüft werden je Contract-Part: Node-ID vorhanden, Name, Typ, Key,
// Property-Keys (inkl. `#id`) und Variantenwerte; je Layer: `figmaId` vorhanden.
// Rückgabe: { parts, ok, layers, lok, problems[] } – `problems` muss leer sein.

import { readFileSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "components")
const items = []
const layers = []

for (const file of readdirSync(dir).filter((f) => f.endsWith(".contract.json")).sort()) {
  const contract = JSON.parse(readFileSync(join(dir, file), "utf8"))
  for (const part of contract.parts) {
    const props = (part.props ?? []).map((p) => ({
      n: p.figma,
      t: p.type,
      ...(p.figmaKey && { k: p.figmaKey }),
      ...(p.type === "VARIANT" && { v: Object.keys(p.values ?? {}) }),
    }))
    items.push({ c: contract.id, ...part.figma, props })
  }
  for (const layer of contract.layers ?? []) {
    if (layer.figmaId) layers.push({ c: contract.id, id: layer.figmaId, f: layer.figma })
  }
}

console.log(`const items = ${JSON.stringify(items)};
const layers = ${JSON.stringify(layers)};
const problems = []; let ok = 0, lok = 0;
for (const it of items) {
  const n = await figma.getNodeByIdAsync(it.id);
  if (!n) { problems.push(it.c + ": fehlt " + it.id + " " + it.name); continue; }
  if (n.name !== it.name) problems.push(it.c + ": Name " + JSON.stringify(n.name) + " ≠ " + JSON.stringify(it.name));
  if (n.type !== it.type) problems.push(it.c + ": Typ " + n.type + " ≠ " + it.type + " (" + it.name + ")");
  if (it.key && n.key !== it.key) problems.push(it.c + ": Key ≠ (" + it.name + ")");
  const isVariant = n.type === "COMPONENT" && n.parent.type === "COMPONENT_SET";
  const defs = isVariant ? {} : n.componentPropertyDefinitions ?? {};
  for (const p of it.props) {
    if (p.k) { if (!defs[p.k]) problems.push(it.c + ": Property " + p.k + " fehlt (" + it.name + ")"); continue; }
    if (p.t !== "VARIANT") continue;
    const d = defs[p.n];
    if (!d) { problems.push(it.c + ": Variante " + p.n + " fehlt (" + it.name + ")"); continue; }
    for (const v of p.v) if (!d.variantOptions.includes(v)) problems.push(it.c + ": Wert " + p.n + "=" + v + " fehlt (" + it.name + ")");
  }
  ok++;
}
for (const l of layers) {
  if (await figma.getNodeByIdAsync(l.id)) lok++;
  else problems.push(l.c + ": Ebene fehlt " + l.id + " (" + l.f + ")");
}
return { parts: items.length, ok, layers: layers.length, lok, problems };`)
