function getFocus() {
	document.getElementById("noteTitle").focus()
}

function removeNote(thisNote) {
	thisNote.parentNode.removeChild(thisNote);
	deleteNote();
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
	var deleteNote = document.createElement("input");
	
	header.innerHTML = title;	
	
	note.className = "note";	
	note.setAttribute("id","eachNote");
	note.setAttribute("onclick", "newNote()");
	note.setAttribute("type", "submit");
	note.appendChild(header);
	note.appendChild(body);
	note.appendChild(deleteNote);
	document.getElementById("notes").appendChild(note);
	writeDb( title, text);
}

var db = openDatabase('notesDb', '1.0', 'Test DB', 2 * 1024 * 1024);
var msg;
var devNote = {Title:"dev title3",Body:"dev body",CreateDate:"1 July",ModDate:"2 Dec"}

function writeDb(Title,Body)
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
		var tempCreateDate = "t1";
		var tempModDate = "t2";
		//var tempCreateDate = devNote.CreateDate;
		//var tempModDate = devNote.ModDate;
		tx.executeSql('INSERT INTO ourNotes (id, Title, Body, CreateDate, ModDate) VALUES (?, ?, ?, ?, ?)', [newId, tempTitle, tempBody, tempCreateDate, tempModDate]);
		msg = '<p>Log message created and row inserted.</p>';
		document.querySelector('#status').innerHTML =  msg;
	});
}

function testWriteDb()
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
		var tempTitle = devNote.Title;
		var tempBody = devNote.Body;
		var tempCreateDate = devNote.CreateDate;
		var tempModDate = devNote.ModDate;
		tx.executeSql('CREATE TABLE IF NOT EXISTS ourNotes (id unique, Title, Body, CreateDate, ModDate)');
		tx.executeSql('INSERT INTO ourNotes (id, Title, Body, CreateDate, ModDate) VALUES (?, ?, ?, ?, ?)', [newId, tempTitle, tempBody, tempCreateDate, tempModDate]);
		msg = '<p>Log message created and row inserted.</p>';
		document.querySelector('#status').innerHTML =  msg;
	});
}

function testReadDb()
{
	db.transaction(function (tx) 
	{
		tx.executeSql('SELECT * FROM ourNotes', [], function (tx, results) 
		{
			var len = results.rows.length, i;
			msg = "<p>Found rows: " + len + "</p>";
			document.querySelector('#status').innerHTML +=  msg;
			for (i = 0; i < len; i++)
			{
				msg = "<p><b>" + results.rows.item(i).Title + " " + results.rows.item(i).Body + " " + results.rows.item(i).CreateDate + " " + results.rows.item(i).ModDate + "</b> </p>";
				document.querySelector('#status').innerHTML +=  msg;
			}
		}, null);
	});
}

function loadNotes()
{
	db.transaction(function (tx) 
	{
		tx.executeSql('SELECT * FROM ourNotes', [], function (tx, results) 
		{
			var len = results.rows.length, i;
			//msg = "<p>Found rows: " + len + "</p>";
			//document.querySelector('#status').innerHTML +=  msg;
			for (i = 0; i < len; i++)
			{
			newNote();
				var newTitle = results.rows.item(i).Title;
				var newText = results.rows.item(i).Body;
				//document.querySelector('#status').innerHTML +=  msg;
				applyNoteOnLoad(newTitle, newText);
			}
		}, null);
	});
}
function applyNoteOnLoad(title, text){

	endDialogue();
	
	var note = document.createElement("div");
	var header = document.createElement("H3");
	var body = document.createTextNode(text);
	
	header.innerHTML = title;
	//body.innerHTML = text;	
	body.className = "noteText";
	
	note.className = "note";	
	note.setAttribute("id","new");
	note.setAttribute("onclick", "newNote()");
	note.setAttribute("type", "submit");
	note.appendChild(header);
	note.appendChild(body);
	document.getElementById("notes").appendChild(note);
}

function deleteNote()
{	
	// Get id or title from note to be deleted

	// Delete that row from database
		db.transaction(function (tx) 
	{
		//tx.executeSql('DELETE FROM ourNotes WHERE id = ?', [1], success, error);
		tx.executeSql('DELETE FROM ourNotes WHERE id = ?', [1]);
	});
	// Delete the html for that note
	alert("b");
}

function getTimestamp()
{
    var timestamp;
	// this._timestamp = x;
    // var date = new Date();
	timestamp = new Date().getTime();
    //date.setTime(parseFloat(x));
	alert(timestamp);
    //this.lastModified.textContent = modifiedString(date);
}
