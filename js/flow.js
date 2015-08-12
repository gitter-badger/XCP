count = 1 
function addRuleInput(ruleset) {
test = 	'<div class="form-group add" id="add_'+count+'">'+
		'<label for="description" class="col-sm-2 control-label">' + $( 'h3' ).html() + ' => </label>' +
	    '<div class="col-sm-2">' +
	    '<div class="input-group">'+
		'<input name="ruleset_'+ruleset+'" value="" type="text" class="form-control" id="description">'+
		'<span class="input-group-btn">'+
		'<button type="button" onclick="removeRule(\'add_'+count+'\')" class="btn"><i class="fa fw fa-trash"></i></button>'+
		'</span>'+
		'</div>'+
		'<div class="checkbox"><label><input name="add" type="checkbox" value="">Persist assignment</label></div>'+
		'</div></div>'
	$( '.ruleset_' + ruleset ).append(test);
	count = count + 1;
}

function updateStatusDesc(statusId, name, desc) {
	console.log(statusId + ' ' + name + ' ' + desc);
	$.ajax({
		url: 'data/activity.mapping.update.php',
		data: {	type: 'info', id: statusId, name: name, desc: desc}
	})
	.done(function( e ) {
		console.log( "success: " + e );
		$( '#name_form' ).addClass('has-success').addClass('has-feedback')
		$( '#feedbackSuccess_name' ).fadeIn('slow');
		$( '#inputSuccess3Status_name' ).fadeIn('slow');
		$( '#feedbackSuccess_name' ).delay( 300 ).fadeOut('slow');
		$( '#inputSuccess3Status_name' ).delay( 300 ).fadeOut('slow', function() {
			$( '#name_form' ).removeClass('has-success').fadeIn('fast');
		});
		$( '#desc_form' ).addClass('has-success').addClass('has-feedback')
		$( '#feedbackSuccess_desc' ).fadeIn('slow');
		$( '#inputSuccess3Status_desc' ).fadeIn('slow');
		$( '#feedbackSuccess_desc' ).delay( 300 ).fadeOut('slow');
		$( '#inputSuccess3Status_desc' ).delay( 300 ).fadeOut('slow', function() {
			$( '#desc_form' ).removeClass('has-success').fadeIn('fast');
		});
	})
	.fail(function( e ) {
		console.log(e);
	})
	
}


function updateRule(id, value, assign) {
	console.log(id + ' ' + value + ' ' + assign);
	$.ajax({
		url: 'data/activity.mapping.update.php',
		data: {	type: 'rule', id: id, value: value, assign: assign}
	})
	.done(function( e ) {
		console.log( "success: " + e );
		$( '#editRule_'+id ).addClass('has-success').addClass('has-feedback')
		$( '#feedbackSuccess_'+id ).fadeIn('slow');
		$( '#inputSuccess3Status_'+id ).fadeIn('slow');
		$( '#feedbackSuccess_'+id ).delay( 300 ).fadeOut('slow');
		$( '#inputSuccess3Status_'+id ).delay( 300 ).fadeOut('slow', function() {
			$( '#editRule_'+id ).removeClass('has-success').fadeIn('fast');
		});
	})
	.fail(function( e ) {
		console.log( "error" + e );
		$( '#editRule_'+id ).addClass('has-error').addClass('has-feedback')
		$( '#feedbackError_'+id ).fadeIn('slow');
		$( '#inputError2Status_'+id ).fadeIn('slow');
		$( '#feedbackError_'+id ).delay( 300 ).fadeOut('slow');
		$( '#inputError2Status_'+id ).delay( 300 ).fadeOut('slow', function() {
			$( '#editRule_'+id ).removeClass('has-error').fadeIn('fast');
		});
	})
	
}

function removeRule(input) {
	var id = input.split("_")[1];
	var idType = input.split("_")[0];
	switch (idType) {
		case 'editRule':
			console.log('delete: EDIT');
			$.ajax({
				url: 'data/activity.mapping.update.php',
				data: {	type: 'delete', id: id}
			})
			.done(function( e ) {
				console.log( "success: " + e );
				$('#' + input).fadeOut('slow').remove()
			})
			.fail(function( e ) {
				console.log( "error" + e );
			})
			break;
		case 'add':
			//
			console.log('delete: ' + id);
			$('#' + input).fadeOut('slow').remove()
			setBase()
			break;
	}
}

function addRule(id, valueTo, valueFrom, assign, set) {

	console.log(id + ' ' + valueTo + ' ' + valueFrom + ' ' + assign + ' ' + set);
	$.ajax({
		url: 'data/activity.mapping.update.php',
		data: {	type: 'addRule',toStage: valueTo, fromStage: valueFrom, assign: assign, set: set}
	})
	.done(function( e ) {
		console.log( "addRule: success: " + e );
		$( '#'+id+' > div > div > input' ).attr('readonly', true);
		$( '#'+id+' > div > div > label > input' ).attr('disabled', true);
		$( '#'+id+' > div > div > span > button' ).attr('disabled', true);
		location.reload();
	})
	.fail(function( e ) {
		console.log( "addRule: error" + e );
	})
}

function update() {
    //Set updated values
    updateDescRequired = false;
    requireUpdateRule = false;
	updateData = {
		statusId: $( '#statusId' ).val(),
		name: $( '#name' ).val(),
		desc: $( '#description' ).val(),
		rules: []
	}
    $( '.editRule > .form-group' ).each(function(index, el) {
		var id = $(el).attr( "id" );
		var value = $( '#'+id+' > div > div > input' ).val();
		var assign = $( '#'+id+' > div > div > label > input' ).is(':checked')
		updateData['rules'].push({id: id, value: value, assign: assign});
	});
	if(updateData['name'] != initialData['name'] || updateData['desc'] != initialData['desc']) {
		updateStatusDesc(updateData['statusId'], updateData['name'], updateData['desc'])
	}
	$.each(updateData['rules'], function(index, item) {
		$.each(item, function(key, item1) {
			if(item1 != initialData['rules'][index][key]){
				requireUpdateRule = true;
			}
		});
		if(requireUpdateRule) {
			updateRule(updateData['rules'][index].id.replace('editRule_',''), updateData['rules'][index].value, updateData['rules'][index].assign);
			requireUpdateRule = false;
		}
	});
	$.each($('.add'), function(index, item) {
		var id = $(item).attr( "id" );
		var value = $( '#'+id+' > div > div > input' ).val();
		var assign = $( '#'+id+' > div > div > label > input' ).is(':checked')
		addRule(id, value, $( '#currentStage' ).html(), assign, $( '#'+id+' > div > div > input').attr('name').replace('ruleset_',''))
	});
	setBase()
}
function setBase() {
//Set initial values
	initialData = {
		name: $( '#name' ).val(),
		desc: $( '#description' ).val(),
		rules: []
	}
    $( '.editRule > .form-group' ).each(function(index, el) {
		var id = $(el).attr( "id" );
		var value = $( '#'+id+' > div > div > input' ).val();
		var assign = $( '#'+id+' > div > div > label > input' ).is(':checked')
		initialData['rules'].push({id: id, value: value, assign: assign});
	});
}

$(function() {
	setBase()
});
