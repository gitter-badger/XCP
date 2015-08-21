<?php 

require("php/init.php");
$user = new User();
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
			Activity::changeItemData($xcpid, $key, $value, $method, $source, $user->data()->id)
		}
	}
}


$out = array('status' => '200',
			 'message' => 'That is wrong!!');

print(json_encode($out));

?>