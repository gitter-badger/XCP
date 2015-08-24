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
					// set some updates to remove help/error text
					$( '#dataModal' ).find( 'form' ).children( '.form-group' ).focusin(function( e ){ 
						console.log('focus trigger');
						console.log( e );
						console.log( e.target );
						var errEll = '#err_' + $(e.target).attr('id')
						console.log(errEll);
						$( errEll ).html('')
					});
					
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
						var ell = $(value).find('input,textarea');
						var nodeType = $(ell).prop('nodeName');
						switch(nodeType){
							case 'INPUT':
								var val = $(value).find( 'input' ).val();
								var id = $(value).find( 'input' ).attr('id');
								var src = $(value).find( 'input' ).attr('data-source');
								break;
							case 'TEXTAREA':
								console.log($(value).find( 'textarea' ));
								var val = $(value).find( 'textarea' ).val();
								var id = $(value).find( 'textarea' ).attr('id');
								var src = $(value).find( 'textarea' ).attr('data-source');
								break;
							default:
						}
						data.push({"id" : id,"value" : val,"source": src});	
					});
					console.log(data);
					butSend.addClass( 'disabled' );
					$.ajax({
						url: 'testupdate.php',
						type: 'POST',
						dataType: 'json',
						data: { data: JSON.stringify(data),
								xcpid: xcpid,
								action_id: action_id
							},
					})
					.done(function( updateData ) {
						//console.log(updateData);
						if( updateData.dbStatus == "100") {
							butSend.unbind(); //Remove on click listener
							cancBut.unbind(); //Remove on click listener
							modal.modal( 'hide' )
							callback( true );
						} else if( updateData.dbStatus == "200" ) {
							//validation error	
							$( '#dataModalError' ).find( '#errorText' ).html('<strong>Uh oh,</strong> there were some errors...<br><span id="retErr"></span>');
							$.each(updateData.details, function(index, error){
								console.log(error);
								$( '#err_' + index ).html( error.message );
							})
							$( '#dataModalError' ).fadeIn('slow');
							butSend.removeClass( 'disabled' );
						} else {
							butSend.button( 'error' );
							$( '#dataModalError' ).find( '#errorText' ).html('Unknown error: ' + updateData.dbStatus + " (" + updateData.message + ")<br>Please contact your Administrator.");
							console.log(updateData.message);
							$( '#dataModalError' ).fadeIn('slow');
						}
						
					})
					.fail(function( data ) {
						console.log("error: " + data.dbStatus + " (" + data.statusText + ")" );
						butSend.button( 'error' );
						$( '#dataModalError' ).find( '#errorText' ).html('Network error: ' + data.dbStatus + " (" + data.statusText + ")<br>Please contact your Administrator.");
						$( '#dataModalError' ).fadeIn('slow');
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
				$( '#dataModalError' ).find( '#errorText' ).text('Unknown action: ' + action_id);
				$( '#dataModalError' ).fadeIn('slow');
				butSend.button( 'error' );
		}

	})
	.fail(function() {
		console.log("error");
	})
	
	


}