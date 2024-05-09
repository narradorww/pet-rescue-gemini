import * as fs from 'fs';
import * as path from 'path';
import {
    BUILT_IN_RAW_DIR,
    BUILT_IN_FONT_DIR,
} from './const';

type RecursiveDirectoryCallback<T> = (filepath: string) => T;

const recursiveDirectory = function <T>(dir: string, cb: RecursiveDirectoryCallback<T>): T[] {
    let files = fs.readdirSync(dir).map(name => path.resolve(dir, name));
    const ret: T[] = [];

    while (true) {
        const filepath = files.shift();

        if (!filepath) {
            break;
        }

        if (fs.statSync(filepath).isDirectory()) {
            const subFilepaths = fs.readdirSync(filepath).map(name => path.resolve(filepath, name));

            files = [...files, ...subFilepaths];
            continue;
        }

        ret.push(cb(filepath));
    }

    return ret;
};


const parseDefinition = function (line: string) {
    let token = '';
    const defs: string[] = [];

    for (const char of line) {
        if (char === ' ' && token) {
            defs.push(token);
            token = '';
        }

        if (char !== ' ') {
            token += char;
        }
    }

    if (token) {
        defs.push(token);
    }

    return defs;
};

export const parse = function (filepath: string) {
    try {
        const text = fs.readFileSync(filepath, 'utf-8');
        const matched = /^(?<def>.+?)\n(?<char>[^]*)/u.exec(text);

        if (!matched || !matched.groups?.def || !matched.groups.char) {
            throw Error("Can't parse the content. Its may be in wrong format.");
        }

        const rawDef = matched.groups.def;
        const content = matched.groups.char;
        const defs = parseDefinition(rawDef);

        return {
            defs,
            content,
        };
    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.log('load character error:', e);

        return null;
    }
};

const creatStringArr = (arr: string[]) => '[' + arr.map(d => `'${d}'`).join(',') + ']';
const creatNumberArr = (arr: number[]) => '[' + arr.map(d => `${d}`).join(',') + ']';

export const buildCharacterModules = function (rawDir: string, fontDir: string, fontFileName: string) {
    const fontFilepath = path.resolve(fontDir, `${fontFileName}.js`);
    const fontDeclareFilepath = path.resolve(fontDir, `${fontFileName}.d.ts`);
    try {
        fs.accessSync(fontDir);
    }
    catch {
        fs.mkdirSync(fontDir);
    }

    try {
        fs.accessSync(fontFilepath);
        fs.unlinkSync(fontFilepath);

        fs.accessSync(fontDeclareFilepath);
        fs.unlinkSync(fontDeclareFilepath);
    }
    catch {}

    const parsedFonts: Array<{ defs: string[]; codes: number[], content: string }> = [];
    recursiveDirectory(rawDir, filepath => {
        const info = parse(filepath);
        if (!info) {
            return;
        }

        const { defs, content } = info;
        const codes: number[] = [];
        for (const c of content) {
            codes.push(c.charCodeAt(0));
        }

        parsedFonts.push({
            defs,
            codes,
            content,
        });
    });

    const text = parsedFonts.reduce((t, f, idx) => {
        return t + (
            '\n/**\n'
            + f.content
            + '\n*/\n'
            + `fonts[${idx}] = {\n`
            + `  defs: ${creatStringArr(f.defs)},\n`
            + `  codes: ${creatNumberArr(f.codes)}\n`
            + '};\n'
        );
    }, '');
    const moduleText = (
        'const fonts = [];\n'
        + text
        + 'module.exports.fonts = fonts;\n'
        + `module.exports.name = '${fontFileName}';\n`
    );

    const declareText = (
        'import { FontFamilyObject } from "../types";\n'
        + 'export declare const name: FontFamilyObject["name"];'
        + 'export declare const fonts: FontFamilyObject["fonts"];'
    );

    fs.writeFileSync(fontFilepath, moduleText, 'utf-8');
    fs.writeFileSync(fontDeclareFilepath, declareText, 'utf-8');
}

if (require.main === module) {
    const dirs = fs.readdirSync(BUILT_IN_RAW_DIR);
    dirs.forEach(dir => {
        buildCharacterModules(
            path.resolve(BUILT_IN_RAW_DIR, dir),
            path.resolve(BUILT_IN_FONT_DIR),
            dir,
        );
    })
}