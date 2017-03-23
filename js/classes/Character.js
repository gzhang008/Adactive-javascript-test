var DIRECTION = {
	"DOWN"    : 0,
	"LEFT" : 1,
	"RIGHT" : 2,
	"UP"   : 3
}


var ANIMATION_TIME = 4;
var MOVING_TIME = 15;

function Character(url, x, y, direction) {
	this.x = x; // (in rows)
	this.y = y; // (in rows)
	this.direction = direction;
	this.animationState = -1;
	
	// Load the image inside the image markup
	this.image = new Image();
	this.image.characterReference = this;
	this.image.onload = function() {
		if(!this.complete) 
			throw "Error while loading sprite named \"" + url + "\".";
		
		// Character size
		this.characterReference.width = this.width / 4;
		this.characterReference.height = this.height / 4;
	}
	this.image.src = "sprites/" + url;
}

Character.prototype.drawCharacter = function(context) {
	var frame = 0; // Image number for the animation
	var xOffset = 0, decalageY = 0; // Character position offset to apply
	if(this.animationState >= MOVING_TIME) {
		// If the movement reach or overflow the moving time, we stop it
		this.animationState = -1;
	} else if(this.animationState >= 0) {
		// Set animation frame to display
		frame = Math.floor(this.animationState / ANIMATION_TIME);
		if(frame > 3) {
			frame %= 4;
		}
		
		// Number of pixels left to move between two rows
		var movingPixels = 32 - (32 * (this.animationState / MOVING_TIME));
		
		// With this number, we are defining the offset X and Y.
		if(this.direction == DIRECTION.UP) {
			decalageY = movingPixels;
		} else if(this.direction == DIRECTION.DOWN) {
			decalageY = -movingPixels;
		} else if(this.direction == DIRECTION.LEFT) {
			xOffset = movingPixels;
		} else if(this.direction == DIRECTION.RIGHT) {
			xOffset = -movingPixels;
		}
		
		// Increment frame number
		this.animationState++;
	}
	/*
	 * If none of the condition are true, it means that we are not moving
	 * so we just need to keep the values to 0 for variables:
	 * frame, xOffset et decalageY
	 */
	
	context.drawImage(
		this.image, 
		this.width * frame, this.direction * this.height, // Source rectangle start point to use in our image
		this.width, this.height, // Source rectangle size (Character size)
		// Destination point (depends of the sizee of the character)
		(this.x * 32) - (this.width / 2) + 16 + xOffset, (this.y * 32) - this.height + 24 + decalageY,
		this.width, this.height // Destination rectangle size (Character size)
	);
}

Character.prototype.getAdjacentCoordinates = function(direction) {
	var coord = {'x' : this.x, 'y' : this.y};
	switch(direction) {
		case DIRECTION.DOWN : 
			coord.y++;
			break;
		case DIRECTION.LEFT : 
			coord.x--;
			break;
		case DIRECTION.RIGHT : 
			coord.x++;
			break;
		case DIRECTION.UP : 
			coord.y--;
			break;
	}
	return coord;
}

Character.prototype.move = function(direction, map) {
	// We can not move if there  is a movement in progress ! 
	if(this.animationState >= 0) {
		return false;
	}

	// We change the character direction
	this.direction = direction;
		
	// We are verifying that the setted row is inside the map
	var nextRow = this.getAdjacentCoordinates(direction);
	if(nextRow.x < 0 || nextRow.y < 0 || nextRow.x >= map.getWidth() || nextRow.y >= map.getHeight()) {
		// On retourne un booléen indiquant que le déplacement ne s'est pas fait, 
		// We are returnning a boolean saying the movement is not done,
		// This isn't time consumming and could always  be usefull
		return false;
	}
    
    //Grass detection__(Added)
    if(map.field[nextRow.y][nextRow.x] <= 2){
        return false;
    }
    
	
	// We start the animation
	this.animationState = 1;

	// We move la!
	this.x = nextRow.x;
	this.y = nextRow.y;
		
	return true;
}

//Add a function to jump__(Added)
Character.prototype.getJumpCoordinates = function(direction) {
	var coord = {'x' : this.x, 'y' : this.y};
	switch(direction) {
		case DIRECTION.DOWN : 
			coord.y += 2;
			break;
		case DIRECTION.LEFT : 
			coord.x -= 2;
			break;
		case DIRECTION.RIGHT : 
			coord.x += 2;
			break;
		case DIRECTION.UP : 
			coord.y -= 2;
			break;
	}
	return coord;
}

Character.prototype.jump = function(direction, map) {
	// We can not move if there  is a movement in progress ! 
	if(this.animationState >= 0) {
		return false;
	}

	// We change the character direction
	this.direction = direction;
		
	// We are verifying that the setted row is inside the map
	var nextRow = this.getJumpCoordinates(direction);
	if(nextRow.x < 0 || nextRow.y < 0 || nextRow.x >= map.getWidth() || nextRow.y >= map.getHeight()) {
		// On retourne un booléen indiquant que le déplacement ne s'est pas fait, 
		// We are returnning a boolean saying the movement is not done,
		// This isn't time consumming and could always  be usefull
		return false;
	}
    
    //Grass detection
    if(map.field[nextRow.y][nextRow.x] <= 2){
        return false;
    }
    
	
	// We start the animation
	this.animationState = 1;

	// We move la!
	this.x = nextRow.x;
	this.y = nextRow.y;
		
	return true;
}