
//Render of the Map

var mymap = L.map('mapid').fitWorld();



var CyclOSM = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
            maxZoom: 20,
            
            attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);

	

	

    function getCountry(country){
        $.ajax({
            url: "./php/country.php",
            type: 'POST',
            dataType: 'json',
            data:{
                code: country,
                codeUpper: country.toUpperCase()
            },
            
            success: function(result) {
    
                
    
                if (result.status.name == "ok") {

                    

                    let weather = `${result['data']['weather']['weather'][0]['description']}. Current temperature is 
                    ${Math.floor(result['data']['weather']['main']['temp'] - 273)} &#8451; `

    
                   var info = `<div> <h2>${result['data']['name']}</h2>
                   <br />
                  Capital City: ${result['data']['capital']}<br />
                   Population: ${result['data']['population']}<br />
                   Currency: ${result['data']['currencies'][0]['name']}  ${result['data']['currencies'][0]['symbol']}. 
                    1 US Dollar is equal to ${result['data']['rate']['rates'][result['data']['currencies'][0]['code']]} ${result['data']['currencies'][0]['code']}<br />
                   Current Weather: ${weather} <br />
                   Wikipedia Link: <a target="_blank" href="https://en.wikipedia.org/wiki/${result['data']['name']}">
                    ${result['data']['name']}</a></div>
                    `
                        
    

                    let countrygeoJson = result['data']['countryGeoJSON'];


                    let countryFeature = L.geoJSON(countrygeoJson).addTo(mymap);
                        let bounds = countryFeature.getBounds();
                         let countryCenter = bounds.getCenter();
                         console.log(countryCenter);
                         mymap.fitBounds(bounds);
                         console.log(info);
                         
                        //  var flagicon = L.icon({
                        //     iconUrl: `${result['data']['flag']}`,
                        //     iconSize: [32, 32],
                        //     iconAnchor: [16,32]
                        // });
                         
                        

                         
                       L.marker(countryCenter, {icon: L.icon({
                           iconUrl: `${result['data']['flag']}`,
                           iconSize: [32, 32] })})
                           .bindPopup(info).addTo(mymap);
                    
               

            
    
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

    $('#viewcountry').click(function() {
        let country = $('#country').val().toLowerCase();

        
        
        
    
    
        getCountry(country);
    
        
    
    });

    




   