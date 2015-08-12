<?php
echo 'hello, this is a test page. Please ignore.<br>';
require("php/init.php");
$xcpid = 'XCP3532208';
$test = new Activity($xcpid);

echo "<pre>XCP_ID: " . $xcpid . "<br>";
echo "ACT: " . $test->getCurrentActivity() . ":" . $test->getCurrentStatus() . "<br>";

print_r($test->getActRules());
print_r($test->getInfo());

print_r(Activity::maintainAssign(10,20,1));


echo '</pre><br>-end-';
?>