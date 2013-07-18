var notes = (function() {

	var pub = {};
	
	window.onload=function(){	
		pub.notesLoad();		
	};

	pub.getFocus = function() {
		document.getElementById("msgTitle").focus()
	}

	pub.newNote = function(identity) {
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
		//textArea.rows = "10";
		//textArea.cols = "80";
		
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
		sRemove.setAttribute("onclick","notes.noteRemove(msgTitle.value)");
			
		var sCancel = document.createElement("input");
		sCancel.setAttribute("type", "submit");
		sCancel.setAttribute("value", "Cancel");
		sCancel.setAttribute("onclick","notes.endDialogue()");
		if (identity!="clickToCreateNewNote") {
			var noteCont = new Array();
			noteCont = pub.ReadDb(identity);
			//dialogue.innerHTML = "<form id=\"inputForm\" onSubmit=\"return false\">Title:<input id=\"noteTitle\" value='noteCont.title' type=\"text\"></input><br/><textarea id=\"inputArea\" rows=\"20\" value=noteCont.body></textarea><br/><input type=\"submit\" value=\"submit\" onclick=\"applyNote(noteTitle.value, inputArea.value)\"><input type=\"submit\" value=\"cancel\" onclick=\"endDialogue()\"></form>";
			titleField.setAttribute("value",noteCont.title);
			textArea.value = noteCont.body;
			sButton.setAttribute("onclick","notes.modifyNote(msgTitle.value, msg.value)");
		}
		else{
			sButton.setAttribute("onclick","notes.applyNote(msgTitle.value, msg.value)");
		}
		dialogue.appendChild(sButton);
		dialogue.appendChild(sRemove);
		dialogue.appendChild(sCancel);
		document.body.appendChild(dialogue);
		pub.getFocus();
	}
	
	pub.endDialogue  = function() {
		document.body.removeChild(document.getElementById("dialogue"));
	}

	pub.noteRemove = function(title) {
		localStorage.removeItem(title);
		var element = document.getElementById(title);
		element.parentNode.removeChild(element);
		pub.endDialogue();
	}

	pub.applyNote = function(title, text){
		pub.endDialogue();
		var ModDate = new Date().toString('dd-mm-yyyy h:mm:ss');
		var CreatedDate = new Date().toString('dd-mm-yyyy h:mm:ss');
		
		var note = document.createElement("div");
		note.setAttribute("id",title);
		note.className = "eachNote";
		var editButton = document.createElement("input");
		editButton.setAttribute("id", "editButtonStyle");
		editButton.setAttribute("onclick", "notes.newNote(this.parentNode.id)");
		editButton.setAttribute("type", "submit");
		editButton.setAttribute("value", "Edit");
		var txt = document.createTextNode(title + ModDate + CreatedDate);
		note.appendChild(txt);
		note.appendChild(editButton);
		var element = document.getElementById("notes");
		element.insertBefore(note,element.firstChild);
		
		pub.writeDb(title, text, ModDate, CreatedDate);
	}

	pub.modifyNote = function(title, text){
		pub.endDialogue();
		var ModDate = new Date().toString('dd-mm-yyyy h:mm:ss');
		var notNew = "true";
		pub.writeDb(title, text, ModDate, notNew);
	}

	pub.writeDb = function(Title,Body, NTime, isNewNote)
	{
		var notes = {};
		notes.title = Title;
		notes.body = Body;
		if (notNewNote="true") {
			notes.createdDate = NTime;
		}
			else {
			notes.createdDate = notNewNote;
			}
		notes.modifiedDate = NTime;
		localStorage.setItem( Title, JSON.stringify(notes) );
	}

	pub.ReadDb = function(id)
	{
		var noteStore = {};
		noteStore = JSON.parse( localStorage.getItem( id ) );
		return noteStore;
	}

	pub.notesLoad = function() {
		var localStorageKeys = Object.keys(localStorage); 
		for (var i=0; i < localStorageKeys.length; i++)  {
			var notesList = JSON.parse(localStorage.getItem(localStorageKeys[i]));
			var note = document.createElement("div");
			note.setAttribute("id",notesList.title);
			note.className = "eachNote";
			var editButton = document.createElement("input");
			editButton.setAttribute("id", "editButtonStyle");
			editButton.setAttribute("onclick", "notes.newNote(this.parentNode.id)");
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
	pub.sortByModified = function() {
		var localStorageKeys = Object.keys(localStorage); 
		var notesList = new Array();	
		for (var i=0; i < localStorageKeys.length; i++)  {
			notesList[i] = JSON.parse(localStorage.getItem(localStorageKeys[i]));
			//alert(notesList[i].modifiedDate);
		}
		var date_sort_des = function (note1, note2) {
	    		if (note1.modifiedDate> note2.modifiedDate) return -1;
	  		if (note1.modifiedDate < note2.modifiedDate) return 1;
	  		return 0;
		};
		var sorted = notesList.sort(date_sort_des);
		var element = document.getElementById('notes');
		for (var i=0; i<sorted.length;i++)
		{
			alert(sorted[i].title);
			document.getElementById('notes').innerHTML = "";
			
			var note = document.createElement("div");
			note.setAttribute("id",sorted[i].title);
			note.className = "eachNote";
			
			var editButton = document.createElement("input");
			editButton.setAttribute("id", "editButtonStyle");
			editButton.setAttribute("onclick", "notes.newNote(this.parentNode.id)");
			editButton.setAttribute("type", "submit");
			editButton.setAttribute("value", "Edit");
			
			var txt = document.createTextNode(sorted[i].title + sorted[i].modifiedDate + sorted[i].createdDate);
			note.appendChild(txt);
			note.appendChild(editButton);
			element.insertBefore(note,element.firstChild);
			alert(sorted[i].title);
		}
	}

	pub.sortByCreated = function() {
		var localStorageKeys = Object.keys(localStorage); 
		var notesList = new Array();	
		for (var i=0; i < localStorageKeys.length; i++)  {
			notesList[i] = JSON.parse(localStorage.getItem(localStorageKeys[i]));
			alert(notesList[i].createdDate);
		}
		var date_sort_des = function (note1, note2) {
    			if (note1.createdDate> note2.createdDate) return -1;
 			if (note1.createdDate < note2.createdDate) return 1;
  			return 0;
		};
		var sorted = notesList.sort(date_sort_des);
		for (var i=0; i<sorted.length;i++)
		{
			alert(sorted[i].createdDate)
		}
	}
	
	return pub;
}());
