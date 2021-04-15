
let selectOptions = $('#selectCountry');

//selectOptions.empty();
//selectOptions.append('<option selected="true" disabled>Please Choose a Country</option>');
//selectOptions.prop('selectedIndex', 0);

// $.getJSON('countryBorders.geo.json', function (countries) {
//     var countryarray = {};
//     $.each(countries.features, function (key, entry) {

//         var country = entry.properties.name;
//         var iso_a3 = entry.properties.iso_a3;
//         countryarray.country = iso_a3;

//         selectOptions.append($('<option></option>').attr('value', iso_a3).text(country));
//     })
// });



//Render of the Map

var mymap = L.map('mapid').fitWorld();



var CyclOSM = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
            maxZoom: 20,
            
            attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);



//set up an emty country geojson

var borderGroup = L.featureGroup([]);
var marker = new L.marker();

	

	

    function getCountry(country){
        $.ajax({
            url: "./lib/php/country.php",
            type: 'POST',
            dataType: 'json',
            data:{
                code: country,
                codeUpper: country.toUpperCase()
            },
            
            success: function(result) {
    
                
    
                if (result.status.name == "ok") {
                    console.log(result);


                    let weather = `${result['data']['weather']['weather'][0]['description']}. Current temperature is 
                    ${Math.floor(result['data']['weather']['main']['temp'] - 273)} &#8451; `

    
                   var infoPopup = L.popup().setContent(`<div class='infoPopUp container-fluid'> <h2>${result['data']['name']}</h2>
                   
                  Capital City: ${result['data']['capital']}<br />
                   Population: ${result['data']['population']}<br />
                   Currency: ${result['data']['currencies'][0]['name']}  ${result['data']['currencies'][0]['symbol']}. 
                    1 US Dollar is equal to ${result['data']['rate']['rates'][result['data']['currencies'][0]['code']]} ${result['data']['currencies'][0]['code']}<br />
                   Current Weather: ${weather} <br />
                   Wikipedia Link: <a target="_blank" href="https://en.wikipedia.org/wiki/${result['data']['name']}">
                    ${result['data']['name']}</a></div>`);


                   


                    L.geoJson(result['data']['countryGeoJSON']).addTo(borderGroup);
                    // Add the border and popup to the map so country is highlighted and general information shown
                    borderGroup.bindPopup(infoPopup).addTo(mymap);
                    // Map is also centered after call so the country border is centered and zoomed to the right level after it is selected
                    mymap.fitBounds(borderGroup.getBounds());
                        
                    
                     let countryCenter = borderGroup.getBounds().getCenter()
                    // // countryCenter.bindPopup(infoPopup).openPopup(infoPopup);



                    // borderGroup.bindPopup(infoPopup).openPopup(infoPopup);


                    //set marker to capital instead of center
                    // console.log("country center ", countryCenter);
                    // console.log('cap lat', result['data']['capitalLocation']['results'][0]['geometry']);
                    let center = result['data']['capitalLocation'] == null ? countryCenter : result['data']['capitalLocation']['results'][0]['geometry'];
                    
                    
                        
                    marker.removeFrom(mymap);
                         
                      marker =   L.marker(center, {icon: L.icon({
                           iconUrl: `${result['data']['flag']}`,
                           iconSize: [32, 32] })})
                           .bindPopup(infoPopup).addTo(mymap).openPopup();
                    
               

            
    
                }

              
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                
            }
        }); 

    };



    //country user is in when page initialy load
	

	$( window ).load(function() {
        // Run code

       


        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };
          
          function success(pos) {
            var crd = pos.coords;
            var lat = pos.coords.latitude;
            var lng = pos.coords.longitude;

            mymap.setView([lat, lng], 6);

            

            const currentCountryReq = async () => {
                const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=40ef6af111324d61af3e91ce43af7b96&q=${lat}%2C${lng}&pretty=1`);
                const myJson = await response.json(); //extract JSON from the http response
                // do something with myJson
                //console.log(myJson);
                let countryAlpha3 = myJson['results'][0]['components']['ISO_3166-1_alpha-3'].toLowerCase();
                

                getCountry(countryAlpha3);
              }

              currentCountryReq();
              
              
             
               
          
            
          }
            
          
          function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
          }
          
          navigator.geolocation.getCurrentPosition(success, error, options);
      });


	

	// Countries Info  when button is pressed

    $('#selectCountry').change(function() {
        let country = $('#selectCountry').val().toLowerCase();

        borderGroup.clearLayers();
        marker.remove();
        
        
    
    
        getCountry(country);
    
        
    
    });

    




   