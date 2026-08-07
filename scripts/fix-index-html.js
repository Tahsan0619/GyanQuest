import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), "../index.html");
let t = fs.readFileSync(file, "utf8");
const wrongClose = String.fromCharCode(60, 47, 109, 111, 116, 105, 111, 110, 62);
const rightClose = String.fromCharCode(60, 47, 100, 105, 118, 62);
const wrongOpenSp = String.fromCharCode(60, 109, 111, 116, 105, 111, 110, 32);
const rightOpenSp = String.fromCharCode(60, 100, 105, 118, 32);
const wrongOpen = String.fromCharCode(60, 109, 111, 116, 105, 111, 110, 62);
const rightOpen = String.fromCharCode(60, 100, 105, 118, 62);
t = t.split(wrongClose).join(rightClose);
t = t.split(wrongOpenSp).join(rightOpenSp);
t = t.split(wrongOpen).join(rightOpen);
fs.writeFileSync(file, t);
console.log("index.html fixed");
