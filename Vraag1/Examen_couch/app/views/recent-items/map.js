function(doc) {
	if(doc.created_at != null) {
	    emit(doc.created_at, doc);
	 }
};