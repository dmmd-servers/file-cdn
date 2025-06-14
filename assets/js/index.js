// Defines elements
const elementDirpath = document.getElementById("dirpath");
const elementItems = document.getElementById("items");
if(elementDirpath === null) throw new Error("Element (#dirpath) not found!");
if(elementItems === null) throw new Error("Element (#items) not found!");

// Defines dirname
const parameters = new URLSearchParams(location.search);
const query = parameters.get("q") ?? "/";
const dirname = new URL(query, location.href).pathname;

// Fetches items
const result = await fetch("/d" + dirname);
const items = result.ok ? await result.json() : [];

// Updates elements
elementDirpath.innerText = dirname;
if(!result.ok) elementItems.innerText = "Something went wrong... (Did you even make the \"files/\" folder?)";
else for(let i = 0; i < items.length; i++) {
    const elementItem = document.createElement("a");
    const item = items[i];
    const resolved = new URL(dirname + item, location.href).pathname;
    elementItem.href = item.endsWith("/") ? `/?q=${resolved}` : `/f${resolved}`;
    elementItem.innerText = item;
    elementItems.appendChild(elementItem);
}
