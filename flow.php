<?php 
require_once('php/templates/header.php');
if(!$user->isLoggedIn()){
    Redirect::to('login.php?nexturl=activity.php');
}
?>
<div class="page-header">
<h1><span class="glyphicon glyphicon-random" aria-hidden="true"></span> Activity flow</h1>
</div>
<?php 
if($stage = Input::get('stage')){
	if(!$user->hasPermission('admin')){
	    Redirect::to('flow.php');
	}
	$test = explode (',', $stage);
	// Show info fopr selected stage
	
	$stageInfo = Activity::splitStage($stage, ',');
	$act = $stageInfo['activity'];
	$status = $stageInfo['status'];
	echo '<h3 id="currentStage">' . $act . ":" . $status . '</h3>';
	$Info = Activity::showStages($act,$status);
	$stageInfo = $Info[$act]['INFO'];
	$statusInfo = $Info[$act]['STATUSES'][$status];
	?>

	<form action="" method="post" class="form-horizontal">

	  <div class="form-group" id="name_form">
	    <label for="name" class="col-sm-2 control-label">Name</label>
	    <div class="col-sm-10">
	     	<input value="<?php echo $statusInfo->name ;?>" type="text" class="form-control" name="terst" id="name">
	     	<span id="feedbackSuccess_name" style="display: none" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
	      	<span id="inputSuccess3Status_name" style="display: none" class="sr-only">(success)</span>
	      	<span id="feedbackError_name" class="glyphicon glyphicon-remove form-control-feedback" style="display: none" aria-hidden="true"></span>
			<span id="inputError2Status_name" style="display: none" class="sr-only">(error)</span>
	    </div>
	  </div>
	  <div class="form-group" id="desc_form">
	    <label for="description" class="col-sm-2 control-label">Description</label>
	    <div class="col-sm-10">
	     	 <input value="<?php echo $statusInfo->description ;?>" type="text" class="form-control" id="description">
	      	<input value="<?php echo $statusInfo->id ;?>" type="hidden" id="statusId">
			<span id="feedbackSuccess_desc" style="display: none" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
			<span id="inputSuccess3Status_desc" style="display: none" class="sr-only">(success)</span>
			<span id="feedbackError_desc" class="glyphicon glyphicon-remove form-control-feedback" style="display: none" aria-hidden="true"></span>
			<span id="inputError2Status_desc" style="display: none" class="sr-only">(error)</span>
	    </div>
	  </div>

	  <hr>
	  <div class="rules">
	    <?php
	    	foreach ($statusInfo->rules as $ruleset => $rules) {
	    		echo '<div class="ruleset_'.$ruleset.'"><h3>Ruleset ' . $ruleset . '</h3>';
	    		$pipelines = "";
	    		foreach (Activity::showPipelinesForRuleset($ruleset) as $pipe) {
	    			$pipelines .= $pipe->pipeline_id . ", ";
	    		}
	    		echo '<p>Pipelines: ' . removeAtEnd($pipelines, 2) . '</p>';
	    		foreach ($rules as $rule) {
		    		?>
		    		<div class="editRule">
					 	<div class="form-group" id="editRule_<?php echo $rule['id'] ;?>">
						    <label for="description" class="col-sm-2 control-label"><?php echo $act . ":" . $status ;?> => </label>
						    <div class="col-sm-2">
						    	<div class="input-group">
							      	<input value="<?php echo $rule['stage'] ;?>" type="text" class="form-control">
									<span class="input-group-btn">
							      		<button type="button" onclick="removeRule('editRule_<?php echo $rule['id'] ;?>')" class="btn"><i class="fa fw fa-trash"></i></button>
							      	</span>
							      	<span id="feedbackSuccess_<?php echo $rule['id'] ;?>" style="display: none" class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
							      	<span id="inputSuccess3Status_<?php echo $rule['id'] ;?>" style="display: none" class="sr-only">(success)</span>
							      	<span id="feedbackError_<?php echo $rule['id'] ;?>" class="glyphicon glyphicon-remove form-control-feedback" style="display: none" aria-hidden="true"></span>
		  							<span id="inputError2Status_<?php echo $rule['id'] ;?>" style="display: none" class="sr-only">(error)</span>		
								</div>
								<div class="checkbox">
								  	<label>
										<input type="checkbox" value="" <?php if($rule['assign'] == 1){ echo " checked";} ;?>>
										Persist assignment
									</label>
								</div>
							</div>
					  	</div>
					</div>
		    		<?php
		    	}
		    	?>
		    	</div>
		    	<div class="form-group">
	    			<div class="col-sm-offset-2 col-sm-10">
	      			<button type="button" onclick="addRuleInput(<?php echo "'" . $ruleset . "'"; ?>)" class="btn btn-success btn-sm"><i class="fa fw fa-plus"></i> Add rule</button>
	    			</div>
	  			</div>
	  			<?php
		    }
	    ?>
	  </div>

	  <hr>
	  <div class="form-group">
	    <div class="col-sm-offset-2 col-sm-10">
	      <button type="button" onclick="update()" class="btn btn-primary">Update</button>
	    </div>
	  </div>
	</form>

	<?php
} else {
	// Show list of ACT and STAT
	$stageInfo = Activity::showStages();
	foreach ($stageInfo as $key => $value) {
		echo '<h3>' . $key . ' - ' . $value['INFO']->SHORT_NAME . ' <small>' . $value['INFO']->DESCRIPTION . '</small></h3>';
		echo '<table class="table table-hover"><thead>';
		if($user->hasPermission('admin')){
				$editHead = '<th class="col-md-1"></th>';
			}
		echo '<tr><th class="col-md-1">Stage</th><th class="col-md-2">Name</th><th class="col-md-6">Description</th>' . $editHead . '</tr></thead>';
		foreach ($value['STATUSES'] as $statusId => $statusVal) {
			
			if($user->hasPermission('admin')){
				$edit = '<td class="col-md-1"><a href="?stage='. $statusVal->act . ',' . $statusVal->status .'">edit</a></td>';
			}
			echo '<tr><td class="col-md-1">' . $statusVal->act . ':' . $statusVal->status . '</td><td class="col-md-2">' . $statusVal->name . '</td><td class="col-md-5">' . $statusVal->description . '</td><td class="col-md-1">' . $ruleAllow . '</td>' . $edit . '</tr>';
			unset($ruleAllow);
		}
		echo '</table>';
	}
}
require_once('php/templates/footer.php');
?>
<script src="js/flow.js"></script>