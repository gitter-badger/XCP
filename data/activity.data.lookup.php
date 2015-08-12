<?php 

require("../php/init.php");

$db = DB::getInstance();
$type = Input::get('type');
$key = Input::get('key');

switch ($type) {
	case 'statusName':
		$actData = Activity::splitStage($key, ",");
		$out = Activity::getStatusDescription($actData['status'], $actData['activity']);
		break;

	case 'statusDescription':
		$actData = Activity::splitStage($key, ",");
		$out = Activity::getStatusDescriptionDescription($actData['status'], $actData['activity']);
		break;

	case 'persistantAssignment':
		//echo $key;
		$stages = split("\|", $key);
		$actDataFrom = Activity::splitStage($stages[0], ",");
		$actDataTo   = Activity::splitStage($stages[1], ",");
		$pipeline = $stages[2];

		print_r(Activity::maintainAssign($actDataFrom['activity'],$actDataFrom['status'],$actDataTo['activity'],$actDataTo['status'],$pipeline));
		break;
	
	default:
		# code...
		break;
}

if($out) {
	echo $out;
}