<?php
require_once 'php/templates/header.php';
$xcpid = 'XCP3532208';
$test = new Activity($xcpid);

echo "<pre>XCP_ID: " . $xcpid . "<br>";
echo "ACT: " . $test->getCurrentActivity() . ":" . $test->getCurrentStatus() . "<br>";

#print_r($test->getActRules());
#print_r($test->getInfo());

#print_r(Activity::maintainAssign(10,20,1));

echo '</pre><br>';
?>
<a href="#" onclick="testClick('XCP8652065')" data-xcpid="XCP8652065">test: XCP8652065</a><br>
<a href="#" onclick="testClick('XCP8654565')" data-xcpid="XCP8654565">test: XCP8654565</a><br>
<a href="#" onclick="testClick('XCP6520456')" data-xcpid="XCP6520456">test: XCP6520456</a><br>
<a href="#" onclick="testClick('XCP5847865')" data-xcpid="XCP5847865">test: XCP5847865</a><br>
<script src="js/test.js"></script>

<div class="modal fade" id="dataModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="dataModalLabel"></h4>
      </div>
      <div class="modal-body">
      	<div id="dataModalLoader"><i class="fa fa-spinner fa-pulse"></i></div>
      	<div id="dataModalError"><i class="fa fa-exclamation"></i> There was an error retriving the form.</div>
        <form>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" id="dataModalcancButton">Close</button>
        <button type="sumbit" class="btn btn-primary" data-complete-text="finished!" data-error-text="error >_<" id="dataModalsendButton">Update</button>
      </div>
    </div>
  </div>
</div>

<?php
require_once 'php/templates/footer.php';