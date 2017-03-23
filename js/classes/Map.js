function Map(name) {
	// Create XmlHttpRequest object
	var xhr = getXMLHttpRequest();
		
	// Loading file
	xhr.open("GET", './maps/' + name + '.json', false);
	xhr.send(null);
	if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 in local
		throw new Error("Error Impossible de load map named \"" + name + "\" (HTTP Code : " + xhr.status + ").");
	var mapJsonData = xhr.responseText;
	
	// Data analysis
	var mapData = JSON.parse(mapJsonData);
	this.tileset = new Tileset(mapData.tileset);
	this.field = mapData.field;
	
	// List of characters in the game field
	this.characters = new Array();
}

// Get size of the map in tiles
Map.prototype.getWidth = function() {
	return this.field.length;
}
Map.prototype.getHeight = function() {
	return this.field[0].length;
}

// To add a character
Map.prototype.addCharacter = function(perso) {
	this.characters.push(perso);
}

Map.prototype.drawMap = function(context) {
	for(var i = 0, l = this.field.length ; i < l ; i++) {
		var line = this.field[i];
		var y = i * 32;
		for(var j = 0, k = line.length ; j < k ; j++) {
			this.tileset.drawTile(line[j], context, j * 32, y);
		}
	}
	
	// Draw characters
	for(var i = 0, l = this.characters.length ; i < l ; i++) {
		this.characters[i].drawCharacter(context);
	}
}















