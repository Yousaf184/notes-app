const createOrEditNoteBtn = document.getElementById("createOrEditNoteBtn");
const previewNoteBtn = document.getElementById("previewNoteBtn");
const previewModalContainer = document.getElementById("notePreviewContainer");
const previewModal = document.getElementById("notePreviewModal");
const noteInput = document.getElementById("noteContent");

const SHOW_NOTE_PREVIEW_CLASS = "showPreviewModal";

createOrEditNoteBtn.addEventListener("click", () => {
  createOrEditNoteBtn.classList.add("spin"); // show spinner
  createOrEditNoteBtn.setAttribute("disabled", true);
});

previewNoteBtn.addEventListener("click", (event) => {
  event.preventDefault();

  if (noteInput.value === "") {
    showNotePreview("<h2>Nothing to show</h2>");
  } else {
    previewNoteBtn.classList.add("spin"); // show spinner
    previewNoteBtn.setAttribute("disabled", true);

    getNotePreview(noteInput.value)
      .then((data) => showNotePreview(data.htmlStr))
      .catch((error) => console.log(error.message))
      .finally(() => {
        previewNoteBtn.classList.remove("spin"); // remove spinner
        previewNoteBtn.removeAttribute("disabled");
      });
  }
});

previewModalContainer.addEventListener("click", (event) => {
  if (event.target === previewModalContainer) {
    previewModalContainer.classList.remove(SHOW_NOTE_PREVIEW_CLASS);
    previewModal.innerHTML = "";
  }
});

async function getNotePreview(noteContent) {
  const response = await fetch("/notes/preview", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ noteContent })
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error("preview request failed");
  }
}

function showNotePreview(htmlStr) {
  previewModal.insertAdjacentHTML("afterbegin", htmlStr);
  previewModalContainer.classList.add(SHOW_NOTE_PREVIEW_CLASS);
}
