function testClick(xcpid) {
	//alert('cliked');
	showDataModal(xcpid, function(e){
		console.log(e)
		if( e ) {
			alert('Carry on');
		} else {
			alert('STOP!')
		}
		// do summin based on the return from the modal function
	});
	
}


function showDataModal( xcpid, callback ) {
	$( '#dataModalError' ).hide()
	var modal   = $('#dataModal');
	var butSend = $( '#dataModalsendButton' );
	var cancBut = $( '#dataModalcancButton' );
	butSend.addClass( 'disabled' );
	modal.modal({
  		backdrop: 'static', keyboard: false
	})
	//Get info for the form
	$.ajax({
		url: 'testdata.php',
		type: 'GET',
		dataType: 'html',
		data: {xcpid: xcpid},
	})
	.done(function( data ) {
		//Set form title
		modal.find('.modal-title').text('Add data for: ' + xcpid)
		$( '#dataModalLoader' ).hide()
		butSend.removeClass( 'disabled' );
		$( 'form' ).html( data );
		
	})
	.fail(function( data ) {
		console.log("error: " + data);
		$( '#dataModalLoader' ).hide()
		$( '#dataModalError' ).show()
		butSend.button( 'error' );
	})

	cancBut.click(function(){
		modal.modal('hide')
		cancBut.unbind();
		butSend.unbind();
		callback();
	})

	
	butSend.click(function(event) {
		//Get form elements
		var data = [];
		$( '#dataModal' ).find( 'form' ).children( '.form-group' ).each(function( index, value ){
			console.log(value)
			var val = $(value).find( 'input' ).val();
			var id = $(value).find( 'input' ).attr('id');
			data.push({"id" : id,"value" : val});
		})
		console.log(data);
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
			console.log(data);
			console.log(data.status);
			if( data.status == "100") {
				butSend.unbind(); //Remove on click listener
				cancBut.unbind();
				console.log("success: " + data );
				modal.modal('hide')
				callback(true);
			} else if( data.status == "200" ) {
				//validation error
				$( '#dataModalError' ).html('<i class="fa fa-exclamation"></i> Validation error: <br>' + data.message).fadeIn('slow');
			} else {
				butSend.button( 'error' );
			}
			
		})
		.fail(function( data ) {
			console.log("error: " + data );
		})

 
		
	});


}