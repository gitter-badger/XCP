<?php 

require("php/init.php");

$xcpid = Input::get('xcpid');
$action_id = Input::get('action_id');


$dataTypes = array( 1 =>  'text',
					2 =>  'password',
					3 =>  'date',
					4 =>  'number',
					5 =>  'email',
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
	echo '</label> ';
	switch ($value->data_type) {
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
			if($value->field_prefix || $value->field_suffix) {
				echo '<div class="input-group">';
			}
			if($value->field_prefix) {
				echo '<span class="input-group-addon">' 	. $value->field_prefix . '</span>';
			}
			echo '<input class="form-control" data-source="'. $value->source_table  .'" type="'.$dataTypes[$value->data_type].'" name="'.$value->field_name.'" id="'.$value->field_name.'" ';
			if($value->source_prefill == true && $itemInfo[$value->field_name] != "") {
				echo 'value="'.$itemInfo[$value->field_name].'"';
			}elseif($value->data_placeholder) {
				echo ' placeholder="'.$value->data_placeholder.'"';
			}
			if($value->data_required) {
				echo 'required ';
			}
			echo '>';
			if($value->field_suffix) {
				echo '<span class="input-group-addon">'.$value->field_suffix.'</span>';
			}
			break;
		case 20:
			echo '<textarea data-source="'. $value->source_table  .'" class="form-control" id="'.$value->field_name.'"';
			if($value->data_required) {
				echo ' required ';
			}
			if($value->source_prefill == true && $itemInfo[$value->field_name] != "") {
				echo '>'.$itemInfo[$value->field_name].'</textarea>';
			}elseif($value->data_placeholder) {
				echo ' placeholder="'.$value->data_placeholder.'"></textarea>';
			}else{
				echo ' ></textarea>';
			}

			break;
	
		default:
			# code...
			break;
	}
	if($value->field_prefix) {
				echo '</div>';
		}
	echo '<span id="err_'.$value->field_name.'" class="error-block"></span></div>';
}

?>