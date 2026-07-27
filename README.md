# Single-file stable build

Upload only `index.html` to the repository root and replace the existing file.

This build embeds the CSS and JavaScript directly in the page, preventing mismatched or cached `styles.css` / `app.js` files. It still works in local browser-saving mode and remains Firebase-ready through the inline placeholder configuration.
