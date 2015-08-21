function testClick(xcpid, action_id) {
	//alert('cliked');
	showDataModal(xcpid, action_id, function(e){
		if( e ) {
			console.log('Carry on');
		} else {
			console.log('STOP!')
		}
		// do summin based on the return from the modal function
	});
	
}


function showDataModal( xcpid, action_id, callback ) {
	
	var modal   = $('#dataModal');
	var butSend = $( '#dataModalsendButton' );
	var cancBut = $( '#dataModalcancButton' );
	$( '#dataModalLoader' ).show()
	$( '#dataModalError' ).hide()
	$( 'form' ).html( '' );
	butSend.addClass( 'disabled' );
	modal.modal({
  		backdrop: 'static', keyboard: false
	})
	modal.find('.modal-title').text('Add data for: ' + xcpid)
	cancBut.click(function(){
		modal.modal('hide')
		butSend.button( 'reset' );
		cancBut.unbind(); //Remove on click listener
		butSend.unbind(); //Remove on click listener
		callback();
	})
	//get action type
	$.ajax({
		url: 'data/activity.data.lookup.php',
		data: {type: 'getActionType', key : action_id},
	})
	.done(function( action_type ) {
		console.log("success: " + action_type);
		switch(action_type) {
			case '1':
				//This is an edit of KEY/VALUE DATA
				//Get info for the form
				$.ajax({
					url: 'testdata.php',
					type: 'GET',
					dataType: 'html',
					data: {xcpid: xcpid, action_id: action_id},
				})
				.done(function( data ) {
					//Set form title
					$( '#dataModalLoader' ).hide()
					butSend.removeClass( 'disabled' );
					$( 'form' ).html( data );
					
				})
				.fail(function( data ) {
					console.log("error: " + data);
					$( '#dataModalLoader' ).hide()
					$( '#dataModalError' ).find( '#errorText' ).text('Unable to load form: ' + data);
					$( '#dataModalError' ).fadeIn('slow');
					butSend.button( 'error' );
				})

				butSend.click(function(event) {
					//Get form elements
					var data = [];
					$( '#dataModal' ).find( 'form' ).children( '.form-group' ).each(function( index, value ){
						var val = $(value).find( 'input' ).val();
						var id = $(value).find( 'input' ).attr('id');
						data.push({"id" : id,"value" : val});
					})
					butSend.addClass( 'disabled' );
					$.ajax({
						url: 'testupdate.php',
						type: 'GET',
						dataType: 'json',
						data: { data: JSON.stringify(data),
								xcpid: xcpid
							},
					})
					.done(function( data ) { 
						if( data.status == "100") {
							butSend.unbind(); //Remove on click listener
							cancBut.unbind(); //Remove on click listener
							modal.modal('hide')
							callback(true);
						} else if( data.status == "200" ) {
							//validation error	
							$( '#dataModalError' ).find( '#errorText' ).html('Validation error: ' + data.message);
							$( '#dataModalError' ).fadeIn('slow');
							butSend.removeClass( 'disabled' );
						} else {
							butSend.button( 'error' );
						}
						
					})
					.fail(function( data ) {
						console.log("error: " + data );
					})
				
				});
				break;
			case '2':
				//CHANGE TO SERIOUS DATA
				// TODO
				$( '#dataModalLoader' ).hide()
				$( '#dataModalError' ).find( '#errorText' ).text('I have not done this bit yet');
				$( '#dataModalError' ).fadeIn('slow');
				butSend.button( 'error' );
				break;
			default:
		        //default code block
		        $( '#dataModalLoader' ).hide()
				$( '#dataModalError' ).find( '#errorText' ).text('Unknown action type: ' + action_type);
				$( '#dataModalError' ).fadeIn('slow');
				butSend.button( 'error' );
		}

	})
	.fail(function() {
		console.log("error");
	})
	
	


}