import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const privateKeyPath = path.join(
  __dirname,
  "keys",
  "receipt_private.pem"
);

const publicKeyPath = path.join(
  __dirname,
  "keys",
  "receipt_public.pem"
);


export const RECEIPT_PRIVATE_KEY = fs.readFileSync(privateKeyPath, "utf8");
export const RECEIPT_PUBLIC_KEY = fs.readFileSync(publicKeyPath, "utf8");