import fs from "fs";
import path from "path";

const swagger = JSON.parse(fs.readFileSync("./swagger.json", "utf-8"));
const schemas = swagger?.components?.schemas ?? {};

const enumEntries: string[] = [];

for (const [enumName, schema] of Object.entries(schemas) as any) {
  if (!schema.enum) continue;

  const varnames: string[] = schema["x-enum-varnames"] ?? schema.enum;
  const enumValues: (string | number)[] = schema.enum;

  const extensions: Record<string, any[]> = {};
  for (const [key, val] of Object.entries(schema)) {
    if (
      key.startsWith("x-enum-") &&
      key !== "x-enum-varnames" &&
      Array.isArray(val)
    ) {
      extensions[key.replace("x-enum-", "")] = val as any[];
    }
  }

  const metaEntries = varnames.map((varname: string, i: number) => {
    const fields: Record<string, any> = { value: enumValues[i] };
    for (const [extKey, extVals] of Object.entries(extensions)) {
      fields[extKey] = extVals[i];
    }
    return `  ${varname}: ${JSON.stringify(fields)}`;
  });

  enumEntries.push(
    `export const ${enumName}Meta = {\n${metaEntries.join(
      ",\n"
    )}\n} as const;\n`
  );
}

const output = `// AUTO GENERATED - DO NOT EDIT\n\n${enumEntries.join("\n")}`;
const outPath = path.resolve("./src/types/generated/enum.meta.ts");
fs.writeFileSync(outPath, output, "utf-8");
console.log(`✅ enum.meta.ts generated with ${enumEntries.length} enums`);
