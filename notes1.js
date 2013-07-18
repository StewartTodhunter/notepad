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
	var CreatedDate = new Date().toString('dd-mm-yyyy h:mm:ss');
	var note = document.createElement("div");
	note.setAttribute("id",title);
	note.className = "eachNote";
	var editButton = document.createElement("input");
	editButton.setAttribute("onclick", "newNote(this.parentNode.id)");
	editButton.setAttribute("type", "submit");
	editButton.setAttribute("value", "Edit");
	var txt = document.createTextNode(title + ModDate + CreatedDate);
	note.appendChild(txt);
	note.appendChild(editButton);
	var element = document.getElementById("notes");
	element.insertBefore(note,element.firstChild);
	writeDb(title, text, ModDate, CreatedDate);
}

function modifyNote(title, text){
	endDialogue();
	var ModDate = new Date().toString('dd-mm-yyyy h:mm:ss');
	var notNew = "true";
	writeDb(title, text, ModDate, notNew);
}

function writeDb(Title,Body, NTime, notNewNote)
{
	var notes = {};
	notes.title = Title;
	notes.body = Body;
	if (notNewNote=="true") {
		var noteStore = {};
		noteStore = JSON.parse(localStorage.getItem(Title));
		notes.createdDate = noteStore.createdDate;
	}
	    else {
		notes.createdDate = NTime;
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
	for (var i=0; i < localStorageKeys.length; i++)  {
		var notesList = JSON.parse(localStorage.getItem(localStorageKeys[i]));
		var note = document.createElement("div");
		note.setAttribute("id",notesList.title);
		note.className = "eachNote";
		var editButton = document.createElement("input");
		editButton.setAttribute("onclick", "newNote(this.parentNode.id)");
		editButton.setAttribute("type", "submit");
		editButton.setAttribute("value", "Edit");
		var txt = document.createTextNode(notesList.title + notesList.modifiedDate + notesList.createdDate);
		var element = document.getElementById("notes");
		note.appendChild(txt);
		note.appendChild(editButton);
		element.insertBefore(note,element.firstChild);
	}
}


// based on http://onpub.com/how-to-sort-an-array-of-dates-with-javascript-s7-a109
function sortByModified() {
	var localStorageKeys = Object.keys(localStorage); 	
	for (var i=0; i < localStorageKeys.length; i++)  {
		var wholeNoteList = JSON.parse(localStorage.getItem(localStorageKeys[i]));		
		var ModifiedDateArray = wholeNoteList.modifiedDate;		
		//alert(ModifiedDateArray);		

		var comparedModifiedList = 
			function (ModifiedDateArray) {
				if (ModifiedDateArray[i] > ModifiedDateArray[i+1]) return -1;
				if (ModifiedDateArray[i] < ModifiedDateArray[i+1]) return 1;
				return 0;
			}; 
	
		/*var note = document.createElement("div");
		note.setAttribute("id",wholeNoteList.title);
		note.className = "eachNote";
		var editButton = document.createElement("input");
		editButton.setAttribute("onclick", "newNote(this.parentNode.id)");
		editButton.setAttribute("type", "submit");
		editButton.setAttribute("value", "Edit");
		var txt = document.createTextNode(wholeNoteList.title + wholeNoteList.modifiedDate + wholeNoteList.createdDate);
		var element = document.getElementById("notes");
		note.appendChild(txt);
		note.appendChild(editButton);
		element.insertBefore(note,element.firstChild);*/
	}
	var sorted = ModifiedDateArray.sort(comparedModifiedList);
}

function sortByCreated() {

}

