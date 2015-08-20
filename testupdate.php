<?php 

require("php/init.php");

$xcpid = Input::get('xcpid');
$datas = Input::get('data');
$datas = json_decode($datas);
$itemInfo = (Activity::showItemData($xcpid));

foreach ($datas as $key => $data) {
	$id = $data->id;
	$newVal = $data->value;
	$oldVal = $itemInfo[$id];

	if($newVal != $oldVal) {
		
		if($oldVal == "" && $newVal != "") {
			//INSERT
		} elseif($oldVal != "" && $newVal == "") {
			//DELETE
		} else {
			//UPDATE
		}
	}
}


$out = array('status' => '100',
			 'message' => 'That is wrong!!');

print(json_encode($out));

?>