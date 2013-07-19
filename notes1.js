var notes = (function() 
{

	var pub = {};
	
	window.onload=function()
	{	
		pub.notesLoad();		
	};

	pub.getFocus = function(itemToFocusOn) 
	{
		itemToFocusOn.focus()
	}

	pub.newNoteDialogue = function(identity) 
	{
		document.getElementById('clickToCreateNewNote').disabled = true;
		var dialogue = document.createElement("div");
		dialogue.setAttribute("id","dialogue");
		
		var br1 = document.createElement("br");
		var br2 = document.createElement("br");
		var titleHeading = document.createElement("span");
		titleHeading.setAttribute("id", "titleLabel");
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
		
		var submitButton = document.createElement("input");
		submitButton.setAttribute("type", "Submit");
		submitButton.setAttribute("value", "Submit");
			
		var cancelButton = document.createElement("input");
		cancelButton.setAttribute("type", "submit");
		cancelButton.setAttribute("value", "Cancel");
		cancelButton.setAttribute("onclick","notes.endDialogue()");
		
		dialogue.appendChild(submitButton);	
		dialogue.appendChild(cancelButton);
		if (identity!="clickToCreateNewNote") 
		{
			var deleteButton = document.createElement("input");					
			deleteButton.setAttribute("type", "Submit");
			deleteButton.setAttribute("value", "Delete");
			deleteButton.setAttribute("onclick","notes.noteRemove(msgTitle.value)");
			dialogue.appendChild(deleteButton);
			
			var noteContent = new Array();
			noteContent = pub.ReadDb(identity);
			titleField.setAttribute("value",noteContent.title);
			titleField.disabled = true;
			textArea.value = noteContent.body;
			submitButton.setAttribute("onclick","notes.modifyNote(msgTitle.value, msg.value)");	
		}
		else
		{
			pub.getFocus(titleField);
			submitButton.setAttribute("onclick","notes.saveNewNote(msgTitle.value, msg.value)");
		}
		document.body.appendChild(dialogue);
		
	}
	
	pub.endDialogue  = function() 
	{
		document.body.removeChild(document.getElementById("dialogue"));
		document.getElementById('clickToCreateNewNote').disabled = false;
	}

	pub.noteRemove = function(title) 
	{
		localStorage.removeItem(title);
		var element = document.getElementById(title); 
		element.parentNode.removeChild(element);
		pub.endDialogue();
	}

	pub.saveNewNote = function(title, text)
	{
		pub.endDialogue();
		//var ModDate = new Date().toString('dd-mm-yyyy h:mm:ss');
		var ModDate = new Date().toLocaleString();
		var CreatedDate = new Date().toLocaleString();
		var txt = document.createTextNode(title + " Modified Date: " + ModDate + "  Created Date: " + CreatedDate);
		var note = document.createElement("div");
		note.setAttribute("id",title);
		note.className = "eachNote";
		
		var editButton = document.createElement("input");
		editButton.setAttribute("id", "editButtonStyle");
		editButton.setAttribute("onclick", "notes.newNoteDialogue(this.parentNode.id)");
		editButton.setAttribute("type", "submit");
		editButton.setAttribute("value", "Edit");
		
		note.appendChild(txt);
		note.appendChild(editButton);
		var element = document.getElementById("notes");
		element.insertBefore(note,element.firstChild);
		
		pub.writeDb(title, text, ModDate, CreatedDate);
	}

	pub.modifyNote = function(title, text)
	{
		document.getElementById('msgTitle').disabled = true;
		pub.endDialogue();
		var thisNote = new Array();
		thisNote = pub.ReadDb(title);
		var DateCreated = thisNote.createdDate;
		var DateModified = new Date().toString('dd-mm-yyyy h:mm:ss');
		pub.writeDb(title, text, DateModified, DateCreated);
		document.getElementById('notes').innerHTML = "";
		pub.notesLoad();
	}

	pub.writeDb = function(Title, Body, ModifiedTimeStamp, CreatedTimeStamp)
	{
		var notes = {};
		notes.title = Title;
		notes.body = Body;
		notes.modifiedDate = ModifiedTimeStamp;
		notes.createdDate = CreatedTimeStamp;
		localStorage.setItem( Title, JSON.stringify(notes) );
	}

	pub.ReadDb = function(id)
	{
		var noteStore = {};
		noteStore = JSON.parse( localStorage.getItem( id ) );
		return noteStore;
	}

	pub.notesLoad = function() 
	{
		document.getElementById('clickToCreateNewNote').disabled = false;
		var localStorageKeys = Object.keys(localStorage); 
		for (var i=0; i < localStorageKeys.length; i++)  
		{
			var notesList = JSON.parse(localStorage.getItem(localStorageKeys[i]));
			var note = document.createElement("div");
			note.setAttribute("id",notesList.title);
			note.className = "eachNote";
			
			var editButton = document.createElement("input");
			editButton.setAttribute("id", "editButtonStyle");
			editButton.setAttribute("onclick", "notes.newNoteDialogue(this.parentNode.id)");
			editButton.setAttribute("type", "submit");
			editButton.setAttribute("value", "Edit");
			
			var txt = document.createTextNode(notesList.title + " Modified Date: " + notesList.modifiedDate + "  Created Date: " +  notesList.createdDate);
			var element = document.getElementById("notes");
			note.appendChild(txt);
			note.appendChild(editButton);
			element.insertBefore(note,element.firstChild);
		}
	}

	pub.refresh = function(sorted) 
	{
		var element = document.getElementById('notes');
		document.getElementById('notes').innerHTML = "";
		for (var i=0; i<sorted.length;i++)
		{
			var note = document.createElement("div");
			note.setAttribute("id",sorted[i].title);
			note.className = "eachNote";
			
			var editButton = document.createElement("input");
			editButton.setAttribute("id", "editButtonStyle");
			editButton.setAttribute("onclick", "notes.newNoteDialogue(this.parentNode.id)");
			editButton.setAttribute("type", "submit");
			editButton.setAttribute("value", "Edit");
			
			var txt = document.createTextNode(sorted[i].title + " Modified Date: " + sorted[i].modifiedDate + "  Created Date: " + sorted[i].createdDate);
			note.appendChild(txt);
			note.appendChild(editButton);
			element.insertBefore(note,element.firstChild);
		}
	}
	
	// based on http://onpub.com/how-to-sort-an-array-of-dates-with-javascript-s7-a109
	pub.sortByModified = function() 
	{
		var localStorageKeys = Object.keys(localStorage); 
		var notesList = new Array();	
		for (var i=0; i < localStorageKeys.length; i++)  
		{
			notesList[i] = JSON.parse(localStorage.getItem(localStorageKeys[i]));
		}
		var date_sort_descending = function (note1, note2) 
		{
	    		if (note1.modifiedDate> note2.modifiedDate) return -1;
	  		if (note1.modifiedDate < note2.modifiedDate) return 1;
	  		return 0;
		};
		var sorted = notesList.sort(date_sort_descending);
		pub.refresh(sorted);
	}
	
	pub.sortByCreated = function() 
	{
		var localStorageKeys = Object.keys(localStorage); 
		var notesList = new Array();	
		for (var i=0; i < localStorageKeys.length; i++)  
		{
			notesList[i] = JSON.parse(localStorage.getItem(localStorageKeys[i]));
		}
		var date_sort_descending = function (note1, note2) 
		{
    			if (note1.createdDate> note2.createdDate) return -1;
 			if (note1.createdDate < note2.createdDate) return 1;
  			return 0;
		};
		var sorted = notesList.sort(date_sort_descending);
		
		pub.refresh(sorted);
	}
	
	return pub;
}());
