/* Keeps complex Operating Model fields out of the page flow until editing is requested. */
const editorDialog = document.createElement("dialog");
editorDialog.className = "operating-editor-dialog";
editorDialog.innerHTML = '<section class="operating-editor-card"><div class="operating-editor-heading"><div><p class="eyebrow">Operating model</p><h2>Edit allocations</h2></div><button class="editor-dialog-close" type="button" aria-label="Close">×</button></div><p class="operating-editor-note">Allocation percentages must add up to 100%.</p><p class="operating-editor-error" role="status"></p><div class="operating-editor-slot"></div></section>';
document.body.appendChild(editorDialog);
const slot = editorDialog.querySelector(".operating-editor-slot"), error = editorDialog.querySelector(".operating-editor-error");
editorDialog.querySelector(".editor-dialog-close").onclick = () => editorDialog.close();
editorDialog.addEventListener("click", event => { if (event.target === editorDialog) editorDialog.close(); });
function validateAllocations() {
  const values = [...slot.querySelectorAll("[data-allocation-percent]")].map(input => parseFloat(String(input.value).replace("%", ""))).filter(value => !Number.isNaN(value));
  const total = values.reduce((sum, value) => sum + value, 0);
  error.textContent = values.length && Math.abs(total - 100) > .01 ? `Allocations total ${total}%. They must total 100%.` : "";
  error.classList.toggle("visible", Boolean(error.textContent));
}
function mountOperatingEditor() {
  const editor = document.querySelector(".operating-strip > .operating-model-editor");
  if (!editor || editor.dataset.dialogReady) return;
  document.querySelectorAll(".operating-editor-trigger").forEach(button => button.remove());
  editor.dataset.dialogReady = "true";
  const trigger = document.createElement("button");
  trigger.type = "button"; trigger.className = "button secondary compact operating-editor-trigger"; trigger.textContent = "Edit operating model";
  trigger.onclick = () => { slot.appendChild(editor); validateAllocations(); editorDialog.showModal(); };
  editor.parentElement.insertBefore(trigger, editor);
  editor.remove();
  slot.appendChild(editor);
  slot.querySelectorAll("[data-allocation-percent]").forEach(input => input.addEventListener("input", validateAllocations));
}
new MutationObserver(mountOperatingEditor).observe(document.body, { childList: true, subtree: true });
mountOperatingEditor();
