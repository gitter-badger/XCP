<?php
session_start();

date_default_timezone_set('Europe/London');

$GLOBALS['config'] = array(
	'mysql' => array(
		'host' => '10.103.109.84\cloud,1500',
		'username' => 'XCP_user',
		'password' => 'Password1',
		'db' => 'UAT-XCP'
	),
	'remember' => array(
		'cookie_name' => 'hash',
		'cookie_expiry' => 604800
	),
	'session' => array(
		'session_name' => 'user',
		'token_name' => 'token'
	)
);
// Include Composer files..
require 'E:/XCP/WEB_UAT/vendor/autoload.php';

// Include all classes
spl_autoload_register(function($class) {
	require_once 'E:/XCP/WEB_UAT/php/classes/' . $class . '.php';
});

// Include all functions
foreach (glob("E:/XCP/WEB_UAT/php/functions/*.php") as $filename)
{
    include_once $filename;
}

if(Cookie::exists(Config::get('remember/cookie_name')) && !Session::exists(Config::get('session/session_name'))) {
	$hash = Cookie::get(config::get('remember/cookie_name'));
	$hashCheck = DB::getInstance()->get('users_session', array('hash', '=', $hash));

	if($hashCheck->count()) {
		$user = new User($hashCheck->first()->user_id);
		$user->login();
	}
}