
function getFocus() {
	document.getElementById("noteTitle").focus()
}

function addNote() {
	var note = document.createElement("Button");
	var txt = document.createTextNode("new note");
	var element = document.getElementById("notes");
	note.setAttribute("id","new");
	note.setAttribute("onclick", "newNote(this.id)");
	note.setAttribute("type", "submit");
	note.appendChild(txt);
	//document.body.appendChild(note);
	element.insertBefore(note,element.firstChild);
}
function newNote(id) {
	var dialogue = document.createElement("div");
	dialogue.setAttribute("id","dialogue");
	if (id=="new") {
		dialogue.innerHTML = "<form id=\"inputForm\" onSubmit=\"return false\">Title:<input id=\"noteTitle\" type=\"text\"></input><br/><textarea id=\"inputArea\" rows=\"20\"></textarea><br/><input type=\"submit\" value=\"submit\" onclick=\"applyNote(noteTitle.value, inputArea.value)\"><input type=\"submit\" value=\"cancel\" onclick=\"endDialogue()\"></form>";
	}
	else
	{
		var noteCont = new Array();
		noteCont = ReadDb(id);
		//alert(noteCont[0]);
		dialogue.innerHTML = "<form id=\"inputForm\" onSubmit=\"return false\">Title:<input id=\"noteTitle\" value=noteCont[0] type=\"text\"></input><br/><textarea id=\"inputArea\" rows=\"20\" value=noteCont[1]></textarea><br/><input type=\"submit\" value=\"submit\" onclick=\"applyNote(noteTitle.value, inputArea.value)\"><input type=\"submit\" value=\"cancel\" onclick=\"endDialogue()\"></form>";
	}
	document.body.appendChild(dialogue);
	getFocus();
}
function endDialogue() {
	document.body.removeChild(document.getElementById("dialogue"));
}

function applyNote(title, text){
	endDialogue();
	var newModDate = new Date().toString('dd-mm-yyyy h:mm:ss');
	var updateTitle = document.getElementById("new");
	updateTitle.innerHTML = title + " " + newModDate;
	updateTitle.setAttribute("id",title);
	writeDb(title, text, newModDate);
}
//creating the database
var db = openDatabase('notesDb', '1.0', 'Test DB', 2 * 1024 * 1024);

function writeDb(Title,Body, NTime)
{
	db.transaction(function (tx) 
	{
		tx.executeSql('CREATE TABLE IF NOT EXISTS ourNotes (id unique, Title, Body, CreateDate, ModDate)');
	});
	
	// Can't insert a row that already exists so find the number of rows and increase id by 1.
	var newId;
	db.transaction(function (tx) 
	{
		tx.executeSql('SELECT * FROM ourNotes', [], function (tx, results) 
			{
			var len = results.rows.length, i;
			newId = len + 1;
			}, null);
	});


	db.transaction(function (tx) 
	{
		var tempTitle = Title;
		var tempBody = Body;
		var tempCreateDate = new Date().toString('dd-mm-yyyy h:mm:ss');
		var tempModDate = NTime;
		tx.executeSql('INSERT INTO ourNotes (id, Title, Body, CreateDate, ModDate) VALUES (?, ?, ?, ?, ?)', [newId, tempTitle, tempBody, tempCreateDate, tempModDate]);
		msg = '<p>Log message created and row inserted.</p>';
		document.querySelector('#status').innerHTML =  msg;
	});
}

function ReadDb(id)
{
	var check = id;
	var notesContent = new Array();
	db.transaction(function (tx) 
	{
		tx.executeSql('SELECT * FROM ourNotes',[], function (tx, results) 
		{
			var len = results.rows.length, i;
			for (i = 0; i < len; i++)
			{
				notesContent[0]=results.rows.item(i).Title;
				notesContent[1]=results.rows.item(i).Body;
				notesContent[2]=results.rows.item(i).CreateDate;
				notesContent[3]=results.rows.item(i).ModDate;
				//alert(notesContent[0]);
			}
		}, null);
	});
	return notesContent;
}