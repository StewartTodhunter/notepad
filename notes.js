function newNote() {
	
	var overlay = document.createElement("div");
	var dialogue = document.createElement("div");
	
	overlay.setAttribute("id","overlay");
	overlay.setAttribute("class", "overlay");
	
	dialogue.setAttribute("id","dialogue");
	dialogue.setAttribute("class", "dialogue");
	
	dialogue.innerHTML = "<form id=\"inputForm\" onSubmit=\"return false\">Title:<input type=\"text\"></input><br/><textarea id=\"inputArea\"></textarea><br/><input type=\"submit\" value=\"submit\" onclick=\"applyNote()\"><input type=\"submit\" value=\"cancel\" onclick=\"endOverlay()\"></form>";
	
	document.body.appendChild(overlay);
	document.body.appendChild(dialogue);	
	
}

function applyNote(name, text) {
	
	endOverlay();
	
	var noteArea = document.getElementById("notes");
	var listItem = document.createElement("div");
	
	listItem.className = "note";
	noteArea.insertBefore(listItem, noteArea.firstChild);
}

function endOverlay() {
	document.getElementById("notes").parentNode.removeChild(overlay);
	document.getElementById("notes").parentNode.removeChild(dialogue);
}
	
function newButton(){
	var note = document.createElement("Button");
	var txt = document.createTextNode("new note");
	note.setAttribute("id","new");
	note.setAttribute("onclick", "newNote()");
	note.setAttribute("type", "submit");
	note.appendChild(txt);
	document.body.appendChild(note);
}