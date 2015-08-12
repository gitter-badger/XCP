<?php
echo 'hello, this is a test page. Please ignore.<br>';
require("php/init.php");
$xcpid = 'XCP5324331';
$test = new Activity($xcpid);

echo "<pre>XCP_ID: " . $xcpid . "<br>";
echo "ACT: " . $test->getCurrentActivity() . ":" . $test->getCurrentStatus() . "<br>";

print_r($test->getActRules());
print_r($test->getInfo());

$test = array(1,2,3,8,8,2,2,2,2);
//$out = array();

foreach ($test as $value) {
	$pipelinesInUse[] = $value;
}

    if(in_array('7', $pipelinesInUse)) {
    	ECHO '8';
    }


$to = array('sdf','ASD');
foreach($to as $email) {
	    	ECHO $email; 
	    }


echo '</pre><br>-end-';
?>