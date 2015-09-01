<?php
require("../php/init.php");
$type = Input::get('type');
switch ($type) {
	case 'rule':
		$id = Input::get('id');
		$value = Input::get('value');
		$assign = Input::get('assign');
		$action = Input::get('action');
		try {
			Activity::updateMappingRule($id, $value, $assign, $action);
		} catch (Exception $e) {
			print_r($e);
		}
		break;
	case 'addRule':
		$toStage = Input::get('toStage');
		$fromStage = Input::get('fromStage');
		$set = Input::get('set');
		$assign = Input::get('assign');
		$action = Input::get('action');
		try {
			Activity::addMappingRule($fromStage, $toStage, $assign, $set, $action);
		} catch (Exception $e) {
			print_r($e);
		}
		break;
	case 'info':
		$id = Input::get('id');
		$name = Input::get('name');
		$desc = Input::get('desc');
		try {
			Activity::updateStageInfo($id, $name, $desc);
		} catch (Exception $e) {
			print_r($e);
		}
		break;
	case 'delete':
		$id = Input::get('id');
		try {
			Activity::deleteMappingRule($id);
		} catch (Exception $e) {
			print_r($e);
		}
		break;
	default:
		# code...
		break;
}
echo 'OK';