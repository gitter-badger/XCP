<?php 
require("php/init.php");
$db = DB::getInstance();
$user = new User();
if(!$user->isLoggedIn()){
	Session::flash('login-error','You must be logged in to view this page!');
    Redirect::to('login.php?nexturl=index.php');
}
$sql = "SELECT [id],[username] FROM [USERS]";
$user_data = $db->query($sql);                   
$user_results = $user_data->results();
$userList = array();
foreach ($user_results as $value) {
	$userList[$value->id] = $value->username;
}

$sql = "SELECT [ID],[STATUS] FROM [ACT_STATUS]";
$status_data = $db->query($sql);                   
$status_results = $status_data->results();
$statusList = array();
foreach ($status_results as $value) {
	$statusList[$value->ID] = $value->STATUS;
}
$sql = "SELECT * FROM [UAT-XCP].[dbo].[mainAudit]";
$data = $db->query($sql);                   
$results = $data->results();

$filename = date("Y-m-d_His") . "_" . $user->data()->username; 

foreach ($data->columns() as $key => $value) {
	$header .= $value . "\t";
}
unset($value);

foreach ($results as $row) {	
   $line = '';
   foreach( $row as $key => $value ) {                                            
        if ( ( !isset( $value ) ) || ( $value == "" ) ) {
           $value = "\t";
        }
        else {
        	if(strpos($key,'_user') !== false) {
        		$value = $userList[$value];
        	}
        	if(strpos($key,'_end_status') !== false) {
        		$value = $statusList[$value];
        	}
            $value = str_replace( '"' , '""' , $value );
            $value = '"' . $value . '"' . "\t";
        }
        $line .= $value;
   }
    $dataOut .= trim( $line ) . "\n";
}

header("Content-type: application/octet-stream");
header("Content-Disposition: attachment; filename=" . $filename . ".xls");
header("Pragma: no-cache");
header("Expires: 0");
print "$header\n$dataOut";