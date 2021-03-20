<?php

	$executionStartTime = microtime(true) / 1000;
$url = 'https://restcountries.eu/rest/v2/alpha/' .$_REQUEST['code'];
  $ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode;


	//data needed for second and third API
	$cityweather = $output['data']['capital'];
	$currencyCode = $output['data']['currencies'][0]['code'];

	//second API for the weather in the capital

	$urlExchange = 'api.openweathermap.org/data/2.5/weather?q=' . $cityweather . '&appid=' . '2478aab088eefc9c75e859f6d8ee98ae';
  $chWeather = curl_init();
	curl_setopt($chWeather, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($chWeather, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($chWeather, CURLOPT_URL,$urlExchange);

	$weather=curl_exec($chWeather);

	curl_close($chWeather);

	$responseWeather = json_decode($weather,true);	


	
	
	
	


	//Api call for Exchange Rate

	$urlExchange ='https://openexchangerates.org/api/latest.json?app_id=32acdbbf613f46b8938e78ba87ce5500&base=usd' . '&symbols=' . $currencyCode;
  $chExchange = curl_init();
	curl_setopt($chExchange, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($chExchange, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($chExchange, CURLOPT_URL,$urlExchange);

	$exchange=curl_exec($chExchange);

	curl_close($chExchange);

	$responseExchange = json_decode($exchange,true);	




	//sending back data for second and third api


	$output['data']['weather'] = $responseWeather;
	$output['data']['rate'] = $responseExchange;

	header('Content-Type: application/json; charset=UTF-8');


	//Api to file for the right country geoJson data

	

	$countries = file_get_contents('../countryBorders.geo.json', FILE_USE_INCLUDE_PATH);

	$countries = json_decode($countries, true);


for ($i = 0; $i < count($countries['features']); $i++)  {
	if ($countries['features'][$i]['properties']['iso_a3'] == $_REQUEST['codeUpper']) {
		$countryGEOJson = $countries['features'][$i];
		break;
	} else {
		$countryGEOJson = 'country not found';
	}
}

  $output['data']['countryGeoJSON'] = $countryGEOJson;

	echo json_encode($output); 

?>
