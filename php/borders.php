<?php





$data = file_get_contents('../countryBorders.geo.json', FILE_USE_INCLUDE_PATH);
$data = json_decode($data, true);




	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>