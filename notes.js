function newNote() {

	var dialogue = document.createElement("div");

	dialogue.setAttribute("id","dialogue");
	//dialogue.setAttribute("class", "dialogue");

	dialogue.innerHTML = "<form id=\"inputForm\" onSubmit=\"return false\">Title:<input id=\"noteTitle\" type=\"text\"></input><br/><textarea id=\"inputArea\" rows=\"20\"></textarea><br/><input type=\"submit\" value=\"submit\" onclick=\"applyNote(noteTitle.value, inputArea.value)\"><input type=\"submit\" value=\"cancel\" onclick=\"endDialogue()\"></form>";

	document.body.appendChild(dialogue);	
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

var db = openDatabase('notesDb', '1.0', 'Test DB', 2 * 1024 * 1024);
var msg;
var devNote = {Title:"dev title1",Body:"dev body",CreateDate:"1 July",ModDate:"2 Dec"}
function testWriteDb()
{

db.transaction(function (tx) {
  tx.executeSql('DROP TABLE ourNotes');
});

db.transaction(function (tx) {
  var tempTitle = devNote.Title;
  var tempBody = devNote.Body;
  var tempCreateDate = devNote.CreateDate;
  var tempModDate = devNote.ModDate;
  //alert(tempCreateDate);
  tx.executeSql('CREATE TABLE IF NOT EXISTS ourNotes (id unique, Title, Body, CreateDate, ModDate)');
  //tx.executeSql('INSERT INTO ourNotes (id, Title, Body, CreateDate, ModDate) VALUES (1, "tempTitle")');
  tx.executeSql('INSERT INTO ourNotes (id, Title, Body, CreateDate, ModDate) VALUES (?, ?, ?, ?, ?)', [1, tempTitle, tempBody, tempCreateDate, tempModDate]);
  //tx.executeSql('INSERT INTO ourNotes (id, log) VALUES (2, "logmsg")');
  msg = '<p>Log message created and row inserted.</p>';
  document.querySelector('#status').innerHTML =  msg;
});
}

function testReadDb()
{
db.transaction(function (tx) {
  tx.executeSql('SELECT * FROM ourNotes', [], function (tx, results) {
   var len = results.rows.length, i;
   msg = "<p>Found rows: " + len + "</p>";
   document.querySelector('#status').innerHTML +=  msg;
   for (i = 0; i < len; i++){
     msg = "<p><b>" + results.rows.item(i).Title + " " + results.rows.item(i).Body + " " + results.rows.item(i).CreateDate + " " + results.rows.item(i).ModDate + "</b> </p>";
     document.querySelector('#status').innerHTML +=  msg;
   }
 }, null);
});

}