function getFocus() {
	document.getElementById('noteTitle').focus()
}

function newNote() {

	var dialogue = document.createElement("div");

	dialogue.setAttribute("id","dialogue");
	dialogue.innerHTML = "<form id=\"inputForm\" onSubmit=\"return false\">Title:<input id=\"noteTitle\" type=\"text\"></input><br/><textarea id=\"inputArea\" rows=\"20\"></textarea><br/><input type=\"submit\" value=\"submit\" onclick=\"applyNote(noteTitle.value, inputArea.value)\"><input type=\"submit\" value=\"cancel\" onclick=\"endDialogue()\"></form>";
	document.body.appendChild(dialogue);
	getFocus();
}

function endDialogue() {
	document.body.removeChild(document.getElementById("dialogue"));
}

function applyNote(title, text){

	endDialogue();
	
	var note = document.createElement("div");
	var header = document.createElement("H3");
	var body = document.createTextNode(text);
	
	header.innerHTML = title;
	
	note.className = "note";	
	note.setAttribute("id","eachNote");
	note.setAttribute("onclick", "newNote()");
	note.setAttribute("type", "submit");
	note.appendChild(header);
	note.appendChild(body);
	document.getElementById("notes").appendChild(note);
}
