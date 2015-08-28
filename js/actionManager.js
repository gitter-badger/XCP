count = 1 
function addRuleInput(ruleset) {
	$( '#xx' ).parent().clone().appendTo($( '.rules' )).html(function(index,html){return html.replace(/xx/g,"a" + count).replace(/yy/g, ruleset);}).fadeIn()
	setUpdates();
	count = count + 1;
}

function updateStatusDesc(title, name, desc) {
	console.log(title + ' ' + name + ' ' + desc);
	// $.ajax({
	// 	url: 'data/activity.mapping.update.php',
	// 	data: {	type: 'info', id: statusId, name: name, desc: desc}
	// })
	// .done(function( e ) {
	// 	console.log( "success: " + e );
	// 	$( '#name_form' ).addClass('has-success').addClass('has-feedback')
	// 	$( '#feedbackSuccess_name' ).fadeIn('slow');
	// 	$( '#inputSuccess3Status_name' ).fadeIn('slow');
	// 	$( '#feedbackSuccess_name' ).delay( 300 ).fadeOut('slow');
	// 	$( '#inputSuccess3Status_name' ).delay( 300 ).fadeOut('slow', function() {
	// 		$( '#name_form' ).removeClass('has-success').fadeIn('fast');
	// 	});
	// 	$( '#desc_form' ).addClass('has-success').addClass('has-feedback')
	// 	$( '#feedbackSuccess_desc' ).fadeIn('slow');
	// 	$( '#inputSuccess3Status_desc' ).fadeIn('slow');
	// 	$( '#feedbackSuccess_desc' ).delay( 300 ).fadeOut('slow');
	// 	$( '#inputSuccess3Status_desc' ).delay( 300 ).fadeOut('slow', function() {
	// 		$( '#desc_form' ).removeClass('has-success').fadeIn('fast');
	// 	});
	// })
	// .fail(function( e ) {
	// 	console.log(e);
	// })
	
}


function updateRule(id, value, assign, action) {
	console.log(id + ' ' + value + ' ' + assign + ' ' + action);
	// $.ajax({
	// 	url: 'data/activity.mapping.update.php', // TODO
	// 	data: {	type: 'rule', id: id, value: value, assign: assign, action: action}
	// })
	// .done(function( e ) {
	// 	console.log( "success: " + e );
	// 	$( '#'+id ).addClass('has-success')
	// 	$( '#'+id ).next().addClass('has-success')
	// 	$( '#ok_' +id ).fadeIn()
	// 	setTimeout(function () {
 //            $( '#'+id ).removeClass('has-success');
 //            $( '#'+id ).next().removeClass('has-success')
 //            $( '#ok_' +id ).fadeOut()
 //        }, 2000);

	// })
	// .fail(function( e ) {
	// 	console.log( "error" + e );
	// 	$( '#'+id ).addClass('has-error');
	// 	$( '#'+id ).next().addClass('has-error');
	// 	$( '#err_' +id ).fadeIn()
	// 	setTimeout(function () {
	// 		$( '#'+id ).removeClass('has-error');
	// 		$( '#'+id ).next().removeClass('has-error');
	// 		$( '#err_' +id ).fadeOut()
	// 	}, 2000);
	// })
	
}

function removeRule(input) {
	var id = input.split("_")[1];
	var idType = input.split("_")[0];
	console.log(id);
	console.log(idType);
	switch (idType) {
	 	case 'editRule':
	 		console.log('delete: EDIT');
	 		// $.ajax({
	 		// 	url: 'data/activity.mapping.update.php',
	 		// 	data: {	type: 'delete', id: id}
	 		// })
	 		// .done(function( e ) {
	 		// 	console.log( "success: " + e );
	 		// 	$('#' + id).parent().fadeOut('slow', function(){
	 		// 		$('#' + id).parent().remove()
	 		// 	})
	 		// })
	 		// .fail(function( e ) {
	 		// 	console.log( "error" + e );
				// $( '#'+id ).addClass('has-error');
				// $( '#'+id ).next().addClass('has-error');
				// $( '#err_' +id ).fadeIn()
				// setTimeout(function () {
				// 	$( '#'+id ).removeClass('has-error');
				// 	$( '#'+id ).next().removeClass('has-error');
				// 	$( '#err_' +id ).fadeOut()
				// }, 2000);
	 		// })
	 		break;
	 	case 'addRule':
	 		//
			console.log('delete: ' + id);
			$('#' + id).parent().fadeOut('300', function(){
				$('#' + id).parent().remove();
			})
			setBase()
			break;
	 }
}

function addRule(id, valueTo, valueFrom, assign, set, action) {

	console.log(id + ' ' + valueTo + ' ' + valueFrom + ' ' + assign + ' ' + set + ' ' + action);
	// $.ajax({
	// 	url: 'data/activity.mapping.update.php',
	// 	data: {	type: 'addRule',toStage: valueTo, fromStage: valueFrom, assign: assign, set: set}
	// })
	// .done(function( e ) {
	// 	console.log( "addRule: success: " + e );
	// 	$( '#' + id ).find( 'select' ).attr('disabled', true);
	// 	$( '#' + id ).next().find( 'select' ).attr('disabled', true);
	// 	$( '#' + id ).next().next().find( 'input' ).attr('disabled', true);
	// 	$( '#' + id ).next().next().next().find( 'button' ).attr('disabled', true);
	// 	location.reload();
	// })
	// .fail(function( e ) {
	// 	$( '#'+id ).addClass('has-error');
	// 	$( '#'+id ).next().addClass('has-error');
	// 	$( '#err_' +id ).fadeIn()
	// 	setTimeout(function () {
	// 		$( '#'+id ).removeClass('has-error');
	// 		$( '#'+id ).next().removeClass('has-error');
	// 		$( '#err_' +id ).fadeOut()
	// 	}, 2000);
	// 	console.log( "addRule: error" + e );
	// })
}

function update() {

    //Set updated values
    updateDescRequired = false;
    requireUpdateRule = false;
	updateData = {
		title: $( '#title' ).val(),
		name: $( '#name' ).val(),
		desc: $( '#description' ).val(),
		rules: []
	}
    $( '.editRule' ).each(function(index, el) {
		var id = $(el).find( 'div' ).attr( "id" );
		var field_id = id;
		var action_id = id;
		var field_name = $( '#field_name_' + id ).val();
		var field_name_display = $( '#field_name_display_' + id ).val();
		var field_prefix = $( '#field_prefix_' + id ).val();
		var field_suffix = $( '#field_suffix_' + id ).val();
		var data_required = $( '#data_required_' + id ).is(':checked');
		var data_child_of = $( '#data_child_of_' + id ).val();
		var data_type = $( '#data_type_' + id ).val();
		var data_validation = $( '#data_validation_' + id ).val();
		var data_placeholder = $( '#data_placeholder_' + id ).val();
		var data_validation_helper = $( '#data_validation_helper_' + id ).val();
		var source_table = $( '#source_table_' + id ).val();
		var source_prefill = $( '#source_prefill_' + id ).is(':checked');
		updateData['rules'].push({
			field_id: field_id,
			action_id: action_id,
			field_name: field_name,
			field_name_display: field_name_display,
			field_prefix: field_prefix,
			field_suffix: field_suffix,
			data_required: data_required,
			data_child_of: data_child_of,
			data_type: data_type,
			data_validation: data_validation,
			data_placeholder: data_placeholder,
			data_validation_helper: data_validation_helper,
			source_table: source_table,
			source_prefill: source_prefill
		});
	});
console.log( updateData );

	//check if the name or description have chnaged, update if required
	if(updateData['name'] != initialData['name'] || updateData['desc'] != initialData['desc'] || updateData['title'] != initialData['title']) {
		updateStatusDesc(updateData['title'], updateData['name'], updateData['desc'])
	}

	// loop all rules to check for changes
	$.each(updateData['rules'], function(index, item) {
		$.each(item, function(key, item1) {
			if(item1 != initialData['rules'][index][key]){
				requireUpdateRule = true;
				console.log( 'Changed' )
			}
		});
		if(requireUpdateRule) {
			updateRule(updateData['rules'][index].id, updateData['rules'][index].value, updateData['rules'][index].assign, updateData['rules'][index].action);
			requireUpdateRule = false;
		}
	});

	// Look for any additional rules that might have been created and add them
	$.each($('.addRule'), function(index, el) {
		data = {};
		var id = $(el).find( 'div' ).attr( "id" );
		if(id != 'xx') {
		var id = $(el).find( 'div' ).attr( "id" );
		var field_id = id;
		var action_id = id;
		var field_name = $( '#field_name_' + id ).val();
		var field_name_display = $( '#field_name_display_' + id ).val();
		var field_prefix = $( '#field_prefix_' + id ).val();
		var field_suffix = $( '#field_suffix_' + id ).val();
		var data_required = $( '#data_required_' + id ).is(':checked');
		var data_child_of = $( '#data_child_of_' + id ).val();
		var data_type = $( '#data_type_' + id ).val();
		var data_validation = $( '#data_validation_' + id ).val();
		var data_placeholder = $( '#data_placeholder_' + id ).val();
		var data_validation_helper = $( '#data_validation_helper_' + id ).val();
		var source_table = $( '#source_table_' + id ).val();
		var source_prefill = $( '#source_prefill_' + id ).is(':checked');
		data.push({
			field_id: field_id,
			action_id: action_id,
			field_name: field_name,
			field_name_display: field_name_display,
			field_prefix: field_prefix,
			field_suffix: field_suffix,
			data_required: data_required,
			data_child_of: data_child_of,
			data_type: data_type,
			data_validation: data_validation,
			data_placeholder: data_placeholder,
			data_validation_helper: data_validation_helper,
			source_table: source_table,
			source_prefill: source_prefill
		});
			addField(id, stage, $( '#currentStage' ).html(), assign, ruleSet, action)
		}
	});

	// set base data
	setBase()
}

function setBase() {
//Set initial values
	initialData = {
		title: $( '#title' ).val(),
		name: $( '#name' ).val(),
		desc: $( '#description' ).val(),
		rules: []
	}
    $( '.editRule' ).each(function(index, el) {
		var id = $(el).find( 'div' ).attr( "id" );
		var field_id = id;
		var action_id = id;
		var field_name = $( '#field_name_' + id ).val();
		var field_name_display = $( '#field_name_display_' + id ).val();
		var field_prefix = $( '#field_prefix_' + id ).val();
		var field_suffix = $( '#field_suffix_' + id ).val();
		var data_required = $( '#data_required_' + id ).is(':checked');
		var data_child_of = $( '#data_child_of_' + id ).val();
		var data_type = $( '#data_type_' + id ).val();
		var data_validation = $( '#data_validation_' + id ).val();
		var data_placeholder = $( '#data_placeholder_' + id ).val();
		var data_validation_helper = $( '#data_validation_helper_' + id ).val();
		var source_table = $( '#source_table_' + id ).val();
		var source_prefill = $( '#source_prefill_' + id ).is(':checked');
		initialData['rules'].push({
			field_id: field_id,
			action_id: action_id,
			field_name: field_name,
			field_name_display: field_name_display,
			field_prefix: field_prefix,
			field_suffix: field_suffix,
			data_required: data_required,
			data_child_of: data_child_of,
			data_type: data_type,
			data_validation: data_validation,
			data_placeholder: data_placeholder,
			data_validation_helper: data_validation_helper,
			source_table: source_table,
			source_prefill: source_prefill
		});
	});
	console.log( initialData );
}

function setUpdates() {
	$( '.activity' ).unbind();
	$( '.activity' ).change(function( e ){ 
		var actButton = $(e.target)
		var staButton = $(e.target).parent().parent().find( '.status' )
		actVal = actButton.val()
		console.log( staButton.val() );
		// $.ajax({
		// 	url: 'data/activity.data.lookup.php',
		// 	dataType: 'JSON',
		// 	data: {	type: 'getStatuses',
		// 			key: actVal},
		// })
		// .done(function( data ) {
		// 	console.log("success");
		// 	console.log( data );
		// 	var optionsAsString = "<option disabled selected value=''>Status</option>";
		// 	$.each(data, function(index, value){
		// 		optionsAsString += "<option value='" + value + "'>" + value + "</option>";
		// 	})
		// 	staButton.html( optionsAsString )
		// })
		// .fail(function( data) {
		// 	staButton.html( "<option disabled selected value=''>Status</option>" )
		// 	console.log("error");
		// })
	});
}

$(function() {
	setBase();
	setUpdates();
});
