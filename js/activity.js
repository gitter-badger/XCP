var resCount = 0;

function testOut(no) {
	$.ajax( 'data/activity.change.php?xcpid=' + no.id + '&status=' + no.value )
			  	.done(function( e ) {
				  	if(e == 'OK') {
				  		refreshTrackerTables();
				  	} else {
				  		alert(e);
				  	}
			  	});
}

function changeStage(xcpid, stage) {
	$.ajax( 'data/activity.change.php?xcpid=' + xcpid + '&status=' + stage )
			  	.done(function( e ) {
				  	if(e == 'OK') {
				  		refreshTrackerTables();
				  	} else {
				  		alert(e);
				  	}
			  	});
}

function claim(no) {
	$.ajax( 'data/activity.claim.php?xcpid=' + no.id )
			  	.done(function( e ) {
				  	if(e == 'OK') {
				  		refreshTrackerTables();
				  	} else {
				  		alert(e);
				  	}
			  	});
}

function unassign(xcpid) {
	$.ajax( 'data/activity.unassign.php?xcpid=' + xcpid )
			  	.done(function( e ) {
				  	if(e == 'OK') {
				  		refreshTrackerTables();
				  	} else {
				  		alert(e);
				  	}
			  	});
}

function refreshTrackerTables() {

	$( '#tasks_team_panel' ).fadeOut("fast");
	$( '#tasks_mine_panel' ).fadeOut("fast");
	$( '#tasks_mine_panel_test' ).fadeIn("fast");
	$( '#tasks_team' ).DataTable().ajax.url( 'data/activity.data.test.php?type=team&stream='	
											+ $( '#select_Pipeline' ).val() 
											+ '&feed='+ $( '#select_feed' ).val() 
											+ '&act=' + $( '#select_act' ).val() ).load( function () {
												resCount ++;
												showTables();
											});
	$( '#tasks_mine' ).DataTable().ajax.url( 'data/activity.data.test.php?type=mine&stream='	
											+ $( '#select_Pipeline' ).val() 
											+ '&feed='+ $( '#select_feed' ).val() 
											+ '&uid='+ $( '#uid' ).val()
											+ '&act=' + $( '#select_act' ).val() ).load( function () {
												if($( "#uid" ).val() == 0 ){
													tasks_mine.column( 4 ).visible( true );
												} else {
													tasks_mine.column( 4 ).visible( false );
												}resCount ++;
												showTables();
											});
	getCounts();							
}

function showTables() {
	if(resCount == 2){
	$( '#tasks_mine_panel_test' ).fadeOut("fast");
	$("time.timeago").timeago();
	$( '#tasks_mine_panel' ).fadeIn("fast");
	$( '#tasks_team_panel' ).fadeIn("fast");
	resCount = 0;
	}
}

function setTrackerTables() {
	tasks_team = $('#tasks_team').DataTable( { 	"ajax": 'data/activity.data.test.php?type=team&stream='+ $( '#select_Pipeline' ).val() + '&feed='+ $( '#select_feed' ).val() + '&act=' + $( '#select_act' ).val(),
													"bAutoWidth": false,
													"order": [[ 3, "asc" ]],
													"columnDefs": [{ "orderable": false, "targets": 7 }],
													"pageLength": 10,
													"dom" : 'rt<"panel-footer foot-sm"fp>',
													"language": {
															      "emptyTable": "No items in this queue.",
															      "sLoadingRecords": "loading..."
															    }
												}).on('draw.dt', function() {
													$("time.timeago").timeago();
												});

	tasks_mine = $('#tasks_mine').DataTable( { 	"ajax": 'data/activity.data.test.php?type=mine&stream='+ $( '#select_Pipeline' ).val() + '&feed='+ $( '#select_feed' ).val() + '&uid='+ $( '#uid' ).val() + '&act=' + $( '#select_act' ).val(),
													"bAutoWidth": false,
													"order": [[ 3, "asc" ]],
													"columnDefs": [ { "orderable": false, "targets": 7 }, 
																	{ "visible": false, "targets": 4 }],
													"pageLength": 10,
													"dom" : 'rt<"panel-footer foot-sm"fp>',
													"language": {
															      "emptyTable": "No items in this queue.",
															      "sLoadingRecords": "loading..."
											    				}
												}).on('draw.dt', function() {
													$("time.timeago").timeago();
												});

}

function getCounts() {

	$( "span[class*='label'][id*='_']" ).fadeOut('fast', function() {
		$( "span[class*='label'][id*='_']" ).html( '<i class="fa fa-spinner fa-pulse"></i>' )
	});
	$( "span[class*='label'][id*='_']" ).fadeIn('fast');
	$.ajax( 'data/activity.count.php?type=team&stream='+ $( '#select_Pipeline' ).val() + '&uid='+ $( '#uid' ).val() + '&feed='+ $( '#select_feed' ).val() )
		.done(function( e ) {
			$( "span[class*='label'][id*='_']" ).fadeOut('fast', function() {
				$( "span[class*='label'][id*='_']" ).html( '0' )
			    e.aaData.forEach( function(i){
			    	$( '#m_' + i[0] ).html( i[1] );
			    	$( '#b_' + i[0] ).html( i[2] );
		    	})
			});
		  	$( "span[class*='label'][id*='_']" ).fadeIn('fast');

		});
}

function setActivity (act) {
	$( '.act_list_item' ).removeClass('active');
	$( '#' + act ).addClass('active');
	$( '#select_act' ).val(act);
	refreshTrackerTables();
}

$(document).ready(function() {

	$( '#10' ).addClass('active');
	$( '#select_act' ).val(10);

	setTrackerTables();
	getCounts();

	$( "#select_Pipeline" ).change(function() {
	  refreshTrackerTables();
	});

	$( "#uid" ).change(function() {
	  refreshTrackerTables();
	});

	$( "#select_feed" ).change(function() {
	  refreshTrackerTables();
	});

});