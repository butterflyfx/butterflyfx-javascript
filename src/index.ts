export * from "./recorder";
export { default as GlobalContext } from "./contexts/global";
export { default as Bookmarklet } from "./browser";
import * as chromeExtension from "./chrome";
export const chrome = chromeExtension;
