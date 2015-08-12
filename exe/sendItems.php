<?php

require("../php/init.php");

// Config
// TODO: Move out of this file
//ftp
$ftp_server = "ftp.hugatramp.com"; 
$ftp_user_name = "xcptest@hugatramp.com"; 
$ftp_user_pass = "xcpTest";
//directories
$dateFile = '../toSend/' . date("Ymd");
$date = date("Y-m-d");
$itemDir = '../items';
//get items at the activity with stage...
$items = Activity::showAtStage(10,20);
print_r($items);

//naming config
$namingArray = array(	1 => 	array(	"name" => "BSI-01-CONV-PDF-BSISDS-",
										"Conversion_Type" => "CONV", 
										"Source_File_Type_1" => "PDF", 
										"Source_File_Type_2" => "N/A", 
										"Output_File_Type" => "BSISDS"
								),
						2 =>	array(	"name" => "BSI-02-CONV-PDF-ISOSTS-", 
										"Conversion_Type" => "CONV", 
										"Source_File_Type_1" => "PDF", 
										"Source_File_Type_2" => "N/A", 
										"Output_File_Type" => "ISOSTS"
								),
						3 =>	array(	"name" => "BSI-03-TRANS-", 
										"Conversion_Type" => "TRANS", 
										"Source_File_Type_1" => "N/A", 
										"Source_File_Type_2" => "N/A", 
										"Output_File_Type" => "N/A"
								),
						4 =>	array(	"name" => "BSI-04-CAPT-PDF-ISOSTS-", 
										"Conversion_Type" => "CAPT", 
										"Source_File_Type_1" => "PDF", 
										"Source_File_Type_2" => "ISOSTS", 
										"Output_File_Type" => "ISOSTS"
								),
						5 =>	array(	"name" => "BSI-05-EXTR-PDF-ISOSTS-",
										"Conversion_Type" => "EXTR", 
										"Source_File_Type_1" => "PDF", 
										"Source_File_Type_2" => "N/A", 
										"Output_File_Type" => "ISOSTS"
								),
						6 =>	array(	"name" => "BSI-06-EXTR-PDF-ISOSTS-", 
										"Conversion_Type" => "EXTR", 
										"Source_File_Type_1" => "PDF", 
										"Source_File_Type_2" => "N/A", 
										"Output_File_Type" => "ISOSTS"
								),
						7 =>	array(	"name" => "BSI-07-CONS-PDF-ISOSTS-", 
										"Conversion_Type" => "CONS", 
										"Source_File_Type_1" => "PDF", 
										"Source_File_Type_2" => "ISOSTS", 
										"Output_File_Type" => "ISOSTS"
								),
						8 =>	array(	"name" => "BSI-08-TERM_MAP-", 
										"Conversion_Type" => "TERM_MAP", 
										"Source_File_Type_1" => "PDF", 
										"Source_File_Type_2" => "N/A", 
										"Output_File_Type" => "ISOSTS"
								)
					);
// CSV Headings
$headers = array(	1  => "XCP_ID",
					2  => "Innodata_Batch_ID[zip filename]",
					3  => "Batch_Return_Date",
					4  => "Conversion_Pipeline",
					5  => "Conversion_Type",
					6  => "Document_Filename (UPI)",
					7  => "Standard_ID",
					8  => "Source_File_Type_1",
					9  => "Source_File_Type_2",
					10 => "Output_File_Type",
					11 => "Page_count",
					12 => "Document_Title"
				);


if(count($items) > 0) {

	// Create container
	if(!file_exists ( $dateFile )) {
		if (!mkdir($dateFile, 0777)) {
			die('Failed to create folder...');
		}
	} else {
		die('Already collated for today.');
	}

	// Create manifest file
	$manifest = fopen($dateFile . "/transmissionSheet_" . $date . ".csv", "w");
	fwrite($manifest, implode(",", $headers) . "\n");

	// Look at all items to be sent
	foreach ($items as $item) {

		// Create pipeline folder, if it doesn't exist
		echo 'ITEM:StreamId => ' . $item->stream_id . "\n";
		if(!file_exists ( $dateFile . "/" . $namingArray[$item->stream_id]["name"] . $date )){
			if (!mkdir($dateFile . "/" . $namingArray[$item->stream_id]["name"] . $date, 0777)) {
				die('Failed to create folder...');
			}
			$pipelinesInUse[] =  $item->stream_id;
			echo "Creating: " . $dateFile . "/" . $namingArray[$item->stream_id]["name"] . $date . "\n";
			$foldersToDelete[] = $dateFile . "/" . $namingArray[$item->stream_id]["name"] . $date;
		}

		// Copy files to pipeline folder
		if (!copy($itemDir . "/" . $item->file_location, $dateFile . "/" . $namingArray[$item->stream_id]["name"] . $date . "/" . $item->file_location)) {
		   die("failed to copy " . $itemDir . "/" . $item->file_location . "...");
		}

		// Manifest Stuff
		$details = array(	$item->XCPID,
							$namingArray[$item->stream_id]["name"] . $date,
							"",
							$item->stream_id,
							$namingArray[$item->stream_id]["Conversion_Type"],
							$item->material_id,
							$item->materialDescription,
							$namingArray[$item->stream_id]["Source_File_Type_1"],
							$namingArray[$item->stream_id]["Source_File_Type_2"],
							$namingArray[$item->stream_id]["Output_File_Type"],
							$item->pageCount,
							str_replace(",", " ", $item->materialTitle)
						);
		fwrite($manifest, implode(",", $details) . "\n");

		// Move to next activity
		echo "UPDATING XCP FOR $item->XCPID \n";
		#$item = new Activity($item->XCPID);
		#$item->moveToActivity('20', '00', 0, false, "Automatic item sending");

	} //End for each
	fclose($manifest);
	$filesToSend[] = array("/transmissionSheet_" . $date . ".csv", $dateFile . "/transmissionSheet_" . $date . ".csv");

	//ZIP Content
	$piplineBatches = scandir($dateFile);
	foreach ($piplineBatches as $piplineBatch) {
		$filesToDelete = array();
    	if ($piplineBatch === '.' or $piplineBatch === '..') continue;
	    if (is_dir($dateFile . '/' . $piplineBatch)) {
	    	$piplineItems = scandir($dateFile . '/' . $piplineBatch);
	    	$zip = new ZipArchive();
	    	echo 'crteating zip: '.$dateFile . '/' . $piplineBatch . '.zip'. "\n";
	    	if ($zip->open( $dateFile . '/' . $piplineBatch . '.zip', ZipArchive::CREATE | ZipArchive::OVERWRITE)!==TRUE) {
			    exit("cannot open zip archive");
			}
	    	foreach ( $piplineItems as $piplineItem ) {
    			if ( $piplineItem === '.' or $piplineItem === '..') continue;
	    		if ( !is_dir($dateFile . '/' . $piplineBatch . '/' . $piplineItem)) {
	    			echo 'adding: ' . $dateFile . '/' . $piplineBatch . '/' . $piplineItem . ' to: ' . $piplineItem . "\n";
	    			$zip->addFile($dateFile . '/' . $piplineBatch . '/' . $piplineItem, $piplineItem);
	    			$filesToDelete[] = $dateFile . '/' . $piplineBatch . '/' . $piplineItem;
	    		}

	    		$filesToSend[] = array($piplineBatch  . '.zip', $dateFile . '/' . $piplineBatch . '.zip');
	    	}
	    	$zip->close();
    	}
    	foreach ($filesToDelete as $file) {
    		echo "deleting: $file \n";
		    unlink($file);
		}
	}
	
	print_r($foldersToDelete);
	foreach ($foldersToDelete as $folder) {
		echo "deleting: $folder \n";
		rmdir($folder);
	}

	//FTP Stuff
	echo "Starting FTP...\n";
	$conn_id = ftp_connect($ftp_server); 
	$login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass); 
	ftp_pasv($conn_id, true);
	if ((!$conn_id) || (!$login_result)) { 
        echo "FTP connection has failed!"; 
        echo "Attempted to connect to $ftp_server for user $ftp_user_name"; 
        exit; 
    }
    //Create new dir on FTP server as todays date and go to it
    ftp_mkdir($conn_id, $date);

    // Upload files
    foreach ($filesToSend as $key => $file) {
    	echo "uploading $file[0]\n";
    #	ftp_put($conn_id,  $date . "/" . $file[0], $file[1] , FTP_BINARY);
    }

    // Email and shit
    echo "Who needs to be emailed:\n";

    if(in_array('8', $pipelinesInUse)) {
    	echo "Starting some email for pl8\n";
	    $mail = new PHPMailer;

	    $mail->isSMTP();
	    $mail->Host = '10.103.109.71';
	    $mail->SMTPAuth = false;
	    $mail->Port = 25;
	    $mail->SMTPOptions = array (
	        'ssl' => array(
	            'verify_peer'  => false,
	            'verify_peer_name'  => false,
	            'allow_self_signed' => true));

	    $mail->From = 'xcp_noreply@bsigroup.com';
	    $mail->FromName = 'XCP';

	    $mail->addAddress('JNemis@INNODATA.COM'); 
	    $mail->addAddress('LGoboy@INNODATA.COM');
	    $mail->addAddress('content.operations@bsigroup.com'); 

	    $mail->isHTML(true); 

	    $mail->addAttachment($dateFile . "/transmissionSheet_" . $date . ".csv", "transmissionSheet_" . $date . ".csv");
	    $mail->Subject = 'Innodata_Batch_Alert_' . $date;
		$mail->Body    = '<p>Dear Innodata,</p>
						  <p>This is to inform you that a new batch has been transferred to Innodata\'s FTP site, for review for producing agreed XML outputs. Attached is a transmission sheet detailing each Material (identified by UPI) in the batch.</p>
						  <p><strong>Please could you confirm receipt of these files and get back on an estimated turnaround time (TAT) and cost. Following this we will confirm whether work should proceed.</strong></p>
						  <p><u>Notes:</u></p>
						  <p>Directory path: /TO INNO/'. $date . '</p>
						  <ul>
						  <li>Materials are batched into zip files according to a single Conversion Pipeline (indicated in the Batch ID and the column Conversion_Pipeline in the transmission sheet)</li>
						  <li>Each Material in the zip file needs to be processed through that Conversion Pipeline </li>
						  <li>Details in the transmission sheet confirm the file types we have provided for each Material (see columns Source_File_Type) and the required XML output (based on Schema, see column Output_File_Type)</li>
						  </ul>
						  <p>Many thanks</p>
						  ';

		if(!$mail->send()) {
		    echo 'Message could not be sent.';
		    echo 'Mailer Error: ' . $mail->ErrorInfo;
		    exit;
		}

    }

    echo "Starting some email for all pl\n";
    $mail = new PHPMailer;

    $mail->isSMTP();
    $mail->Host = '10.103.109.71';
    $mail->SMTPAuth = false;
    $mail->Port = 25;
    $mail->SMTPOptions = array (
        'ssl' => array(
            'verify_peer'  => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true));

    $mail->From = 'xcp_noreply@bsigroup.com';
    $mail->FromName = 'XCP';
    
    //foreach($to as $email) {
    //	$mail->addAddress($email); 
    //}

    $mail->addAddress('content.operations@bsigroup.com'); 
    $mail->addAddress('APradeep@innodata.com'); 
    $mail->addAddress('MMontano@INNODATA.COM'); 
    $mail->addAddress('LGoboy@INNODATA.COM

    $mail->isHTML(true); 

    $mail->addAttachment($dateFile . "/transmissionSheet_" . $date . ".csv", "transmissionSheet_" . $date . ".csv");
    $mail->Subject = 'Innodata_Batch_Alert_' . $date;
	$mail->Body    = '<p>Dear Innodata,</p>
					  <p>This is to inform you that a new batch has been transferred to Innodata\'s FTP site, for review for producing agreed XML outputs. Attached is a transmission sheet detailing each Material (identified by UPI) in the batch.</p>
					  <p><strong>Please could you confirm receipt of these files and get back on an estimated turnaround time (TAT) and cost. Following this we will confirm whether work should proceed.</strong></p>
					  <p><u>Notes:</u></p>
					  <p>Directory path: /TO INNO/'. $date . '</p>
					  <ul>
					  <li>Materials are batched into zip files according to a single Conversion Pipeline (indicated in the Batch ID and the column Conversion_Pipeline in the transmission sheet)</li>
					  <li>Each Material in the zip file needs to be processed through that Conversion Pipeline </li>
					  <li>Details in the transmission sheet confirm the file types we have provided for each Material (see columns Source_File_Type) and the required XML output (based on Schema, see column Output_File_Type)</li>
					  </ul>
					  <p>Many thanks</p>
					  ';

	if(!$mail->send()) {
	    echo 'Message could not be sent.';
	    echo 'Mailer Error: ' . $mail->ErrorInfo;
	    exit;
	}



    // Delete files that have been uploaded
    foreach ($filesToSend as $file) {
    	echo "deleting $file[0]\n";
    	unlink($file[1]);
    }

    // Delete temp date folder
    rmdir($dateFile);


} else {
	die ( 'No files to send.' );
}
