<?php 

require("php/init.php");

$xcpid = Input::get('xcpid');
$action_id = Input::get('action_id');


$dataTypes = array( 1 =>  'text',
					2 =>  'password',
					3 =>  'date',
					4 =>  'textarea',
					5 =>  'number',
					6 =>  'email',
					20 => 'textarea'
					);

$db = DB::getInstance();
$db->query('SELECT * FROM [dbo].[ACTION_LIST] WHERE action_id = ' . $action_id);
$actionInfo = $db->first();

$db->query('SELECT * FROM [dbo].[ACTION_FIELDS] WHERE action_id = ' . $action_id);
$actionFields = $db->results();

foreach ($actionFields as $fieldInfo => $value) {
	$itemInfo = (Activity::showItemData($xcpid, $value->source_table));
	echo '<div class="form-group">';
	echo '<label for="'.$value->field_name.'" class="control-label">';
	echo $value->field_name_display;
	echo '</label>';
	switch ($value->data_type) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
			echo '<input class="form-control" type="'.$dataTypes[$value->data_type].'" name="'.$value->field_name.'" id="'.$value->field_name.'" ';
			if($value->source_prefill == true && $itemInfo[$value->field_name] != "") {
				echo 'value="'.$itemInfo[$value->field_name].'"';
			}elseif($value->data_placeholder) {
				echo ' placeholder="'.$value->data_placeholder.'"';
			}
			if($value->data_required) {
				echo 'required ';
			}
			echo '>';
			break;
		case 20:
			echo '<textarea class="form-control" id="'.$value->field_name.'"';
			if($value->data_required) {
				echo ' required ';
			}
			if($value->source_prefill == true && $itemInfo[$value->field_name] != "") {
				echo '>'.$itemInfo[$value->field_name].'</textarea>';
			}elseif($value->data_placeholder) {
				echo ' placeholder="'.$value->data_placeholder.'"></textarea>';
			}

			break;
	
		default:
			# code...
			break;
	}
	echo '</div>';
}

?>