import { serialize, deserialize } from "bun:jsc";

export function awaitSync(asyncCode: string, vars?: Record<string, unknown>) {
  let varsCode = "";
  if (vars) {
    for (const key in vars) {
      varsCode += "[";
      varsCode += JSON.stringify(key);
      varsCode += ",";
      varsCode += JSON.stringify(
        serialize(vars[key], { binaryType: "nodebuffer" }).toString("base64")
      );
      varsCode += "],";
    }
    varsCode = `Object.fromEntries([${varsCode}].map(([k,v])=>[k,__bun_jsc_deserialize(Buffer.from(v,'base64'))]))`;
  } else {
    varsCode = "{}";
  }

  const code = `import{serialize as __bun_jsc_serialize,deserialize as __bun_jsc_deserialize}from'bun:jsc';const vars=${varsCode};try{process.stdout.write(__bun_jsc_serialize(await(${asyncCode})))}catch(e){process.stderr.write(__bun_jsc_serialize(e))}`;

  const proc = Bun.spawnSync({
    cmd: [process.execPath, "--eval", code],
  });

  if (proc.stderr.length) {
    const err = deserialize(proc.stderr);
    throw err;
  }

  return deserialize(proc.stdout);
}
