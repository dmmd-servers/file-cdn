// Defines elements
const elementDirpath = document.getElementById("dirpath");
const elementList = document.getElementById("list");
if(elementDirpath === null) throw new Error("Element (#dirpath) not found!");
if(elementList === null) throw new Error("Element (#list) not found!");

// Defines dirname
const parameters = new URLSearchParams(location.search);
const query = parameters.get("q") ?? "/";
const dirpath = new URL(query, location.origin).pathname.replace(/\/{2,}/g, "/");

// Fetches items
const result = await fetch(`/d${dirpath}`);
const filenames = result.ok ? await result.json() : [];
if(query !== "/") filenames.unshift("../");

// Updates elements
elementDirpath.innerText = dirpath;
if(!result.ok) elementList.innerText = "Something went wrong...";
else for(let i = 0; i < filenames.length; i++) {
    const elementItem = document.createElement("a");
    const filename = filenames[i];
    const filepath = new URL(dirpath + filename, location.origin).pathname.replace(/\/{2,}/g, "/");
    elementItem.href = filename.endsWith("/") ? `/?q=${filepath}` : `/f${filepath}`;
    elementItem.innerText = filename;
    elementList.appendChild(elementItem);
}
