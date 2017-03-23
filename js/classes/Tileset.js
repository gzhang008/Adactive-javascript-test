function Tileset(url) {
	// Load image inside the image markup
	this.image = new Image();
	this.image.tilesetReference = this;
	this.image.onload = function() {
		if(!this.complete) 
			throw new Error("Error while loading tileset named \"" + url + "\".");
		
		// tileset width in tiles
		this.tilesetReference.width = this.width / 32;
	}
	this.image.src = "tilesets/" + url;
}

// method to draw a tile by number "number" ib the 2D context "context" at the coordinates xDestination and yDestination
Tileset.prototype.drawTile = function(number, context, xDestination, yDestination) {
	var xSourceInTiles = number % this.width;
	if(xSourceInTiles == 0) xSourceInTiles = this.width;
	var ySourceInTiles = Math.ceil(number / this.width);
	
	var xSource = (xSourceInTiles - 1) * 32;
	var ySource = (ySourceInTiles - 1) * 32;
	
	context.drawImage(this.image, xSource, ySource, 32, 32, xDestination, yDestination, 32, 32);
}
