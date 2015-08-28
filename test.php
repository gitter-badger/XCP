<?php
require_once 'php/templates/header.php';
$xcpid = 'XCP3532208';
$test = new Activity($xcpid);

echo "<pre>XCP_ID: " . $xcpid . "<br>";
echo "ACT: " . $test->getCurrentActivity() . ":" . $test->getCurrentStatus() . "<br>";

print_r(Activity::listActionFields(1));

//print_r(Activity::showFieldData('TAT'));

#print_r($test->getActRules());
#print_r($test->getInfo());

#print_r(Activity::maintainAssign(10,20,1));

echo '</pre><br>';
?>
<a href="#" onclick="testClick('XCP8652065', 1)" data-xcpid="XCP8652065">test: XCP8652065</a><br>
<a href="#" onclick="testClick('XCP8654565', 1)" data-xcpid="XCP8654565">test: XCP8654565</a><br>
<a href="#" onclick="testClick('XCP6520456', 2)" data-xcpid="XCP6520456">test: XCP6520456</a><br>
<a href="#" onclick="testClick('XCP6520456', '2d')" data-xcpid="XCP6520456">test: XCP6520456</a><br>
<script src="js/test.js"></script>

<div class="modal fade" id="dataModal" tabindex="-1" role="dialog" aria-labelledby="dataModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="dataModalLabel"></h4>
      </div>
      <div class="modal-body">
        <div id="dataModalLoader"><i class="fa fa-spinner fa-pulse"></i></div>
        <div id="dataModalError" class="alert alert-danger alert-dismissible" role="alert">
          <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <strong><i class="fa fa-exclamation-triangle"></i> </strong><span id="errorText"></span>
        </div>
        <form>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" id="dataModalcancButton">Close</button>
        <button type="sumbit" class="btn btn-primary" data-complete-text="Finished!" data-error-text="Error" id="dataModalsendButton">Update</button>
      </div>
    </div>
  </div>
</div>

<?php
require_once 'php/templates/footer.php';