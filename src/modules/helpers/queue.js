class Queue {
	shuffle(array) {
	  	var itemsQty = array.length, current, index;

	  	// While there remain elements to shuffle…
	  	while (itemsQty) {
		    // Pick a remaining element…
		    index = Math.floor(Math.random() * itemsQty--);

		    // And swap it with the current element.
		    current = array[itemsQty];
		    array[itemsQty] = array[index];
		    array[index] = current;
	  	}

	  return array;
	}	
}


export default Queue