function getFocus() {
	document.getElementById("msgTitle").focus()
}

function newNote(identity) {
	var dialogue = document.createElement("div");
	dialogue.setAttribute("id","dialogue");
	
	var br1 = document.createElement("br");
	var br2 = document.createElement("br");
	var titleHeading = document.createElement("span");
	titleHeading.innerHTML = "Title: ";
	
	var titleField = document.createElement("input");
	titleField.setAttribute("type", "text");
	titleField.setAttribute("id","msgTitle");
	
	var textArea = document.createElement("textarea");
	textArea.setAttribute("id","msg");
	textArea.rows = "10";
	textArea.cols = "80";
	
	dialogue.appendChild(titleHeading);
	dialogue.appendChild(titleField);
	dialogue.appendChild(br1);
	dialogue.appendChild(textArea);
	//dialogue.appendChild(br2);
	
	var sButton = document.createElement("input");
	sButton.setAttribute("type", "Submit");
	sButton.setAttribute("value", "Submit");
	
	var sRemove = document.createElement("input");
	sRemove.setAttribute("type", "Submit");
	sRemove.setAttribute("value", "Remove");
	sRemove.setAttribute("onclick","noteRemove(msgTitle.value)");
		
	var sCancel = document.createElement("input");
	sCancel.setAttribute("type", "submit");
	sCancel.setAttribute("value", "Cancel");
	sCancel.setAttribute("onclick","endDialogue()");
	if (identity!="clickToCreateNewNote") {
		var noteCont = new Array();
		noteCont = ReadDb(identity);
		//dialogue.innerHTML = "<form id=\"inputForm\" onSubmit=\"return false\">Title:<input id=\"noteTitle\" value='noteCont.title' type=\"text\"></input><br/><textarea id=\"inputArea\" rows=\"20\" value=noteCont.body></textarea><br/><input type=\"submit\" value=\"submit\" onclick=\"applyNote(noteTitle.value, inputArea.value)\"><input type=\"submit\" value=\"cancel\" onclick=\"endDialogue()\"></form>";
		titleField.setAttribute("value",noteCont.title);
		textArea.value = noteCont.body;
		sButton.setAttribute("onclick","modifyNote(msgTitle.value, msg.value)");
	}
	else{
		sButton.setAttribute("onclick","applyNote(msgTitle.value, msg.value)");
	}
	dialogue.appendChild(sButton);
	dialogue.appendChild(sRemove);
	dialogue.appendChild(sCancel);
	document.body.appendChild(dialogue);
	getFocus();
}
function endDialogue() {
	document.body.removeChild(document.getElementById("dialogue"));
}

function noteRemove(title) {
	localStorage.removeItem(title);
	var element = document.getElementById(title);
	element.parentNode.removeChild(element);
	endDialogue();
}

function applyNote(title, text){
	endDialogue();
	var ModDate = new Date().toString('dd-mm-yyyy h:mm:ss');
	var note = document.createElement("Button");
	var txt = document.createTextNode(title + " " + ModDate);
	var element = document.getElementById("notes");
	note.setAttribute("id",title);
	note.setAttribute("onclick", "newNote(this.id)");
	note.setAttribute("type", "submit");
	note.appendChild(txt);
	//document.body.appendChild(note);
	element.insertBefore(note,element.firstChild);
	writeDb(title, text, ModDate);
}

function modifyNote(title, text){
	endDialogue();
	var ModDate = new Date().toString('dd-mm-yyyy h:mm:ss');
	writeDb(title, text, ModDate);
}

function writeDb(Title,Body, NTime)
{
	var notes = {};
	notes.title = Title;
	notes.body = Body;
	if (!JSON.parse( localStorage.getItem(Title) )) {
		notes.createdDate = new Date().toString('dd-mm-yyyy h:mm:ss');
	}
	notes.modifiedDate = NTime;
	localStorage.setItem( Title, JSON.stringify(notes) );
}

function ReadDb(id)
{
	var noteStore = {};
	noteStore = JSON.parse( localStorage.getItem( id ) );
	return noteStore;
}

function notesLoad() {
	var localStorageKeys = Object.keys(localStorage);
	if(localStorageKeys)
	{
		for (var i=1; i < localStorageKeys.length; i++)  {
			alert(localStorage.getItem(localStorageKeys[i]));
		}
	}
	else
	{
		alert("Please create a note, you don't have one stored now.");
	}
}	