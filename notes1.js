function newNote() {

	var overlay = document.createElement("div");
	var dialogue = document.createElement("div");

	overlay.setAttribute("id","overlay");
	//overlay.setAttribute("class", "overlay");

	dialogue.setAttribute("id","dialogue");
	//dialogue.setAttribute("class", "dialogue");

	dialogue.innerHTML = "<form id=\"inputForm\" onSubmit=\"return false\">Title:<input id=\"noteTitle\" type=\"text\"></input><br/><textarea id=\"inputArea\"></textarea><br/><input type=\"submit\" value=\"submit\" onclick=\"applyNote(noteTitle.value, inputArea.value)\"><input type=\"submit\" value=\"cancel\" onclick=\"endOverlay()\"></form>";

	document.body.appendChild(overlay);
	document.body.appendChild(dialogue);	

}

function applyNote(name, text) {

	endOverlay();

	var noteArea = document.getElementById("notes");
	var listItem = document.createElement("div");

	listItem.className = "note";
	listItem.innerHTML = name + "<br />" + text;
	noteArea.insertBefore(listItem, noteArea.firstChild);
}

function endOverlay() {
	document.body.removeChild(document.getElementById("overlay"));
	document.body.removeChild(document.getElementById("dialogue"));
}

function applyNote(title, text){

	endOverlay();
	
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
// Create Database if not existing or load existing
var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
var msg;
//var devNote={Title:"test title",Body:"test body",CreateDate:"1st July"};
function writeNoteToDb()
{
  db.transaction(function (tx) {
  tx.executeSql('DROP TABLE ourNotes');
  });
db.transaction(function (tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS ourNotes (id unique, log)');
  });

 db.transaction(function (tx) { 
  tx.executeSql('INSERT INTO ourNotes (id, log) VALUES (1, "foo5bar")');
  tx.executeSql('INSERT INTO ourNotes (id, log) VALUES (2, "logmsg")');
  msg = '<p>Log message created and row inserted.</p>';
  document.querySelector('#status').innerHTML =  msg;
});


db.transaction(function (tx) {
  tx.executeSql('SELECT * FROM ourNotes', [], function (tx, results) {
   var len = results.rows.length, i;
   msg = "<p>Found rows: " + len + "</p>";
   document.querySelector('#status').innerHTML +=  msg;
   for (i = 0; i < len; i++){
     msg = "<p><b>" + results.rows.item(i).log + "</b></p>";
     document.querySelector('#status').innerHTML +=  msg;
   }
 }, null);
});

}



function readNoteFromDb()
{


}