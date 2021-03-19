
//Render of the Map


	var mymap = L.map('mapid').setView([51.505, -0.09], 13);

	var CyclOSM = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

	L.marker([51.5, -0.09]).addTo(mymap)
		.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

	

	L.polygon([
		[51.509, -0.08],
		[51.503, -0.06],
		[51.51, -0.047]
	]).addTo(mymap).bindPopup("I am a polygon.");


	var popup = L.popup();

	// Countries Info 

    $('#viewcountry').click(function() {
        let country = $('#country').val().toLowerCase();
        
        
    
        console.log(country);
    
    
        $.ajax({
            url: "./php/country.php",
            type: 'POST',
            dataType: 'json',
            data:{
                code: country
            },
            
            success: function(result) {
    
                
    
                if (result.status.name == "ok") {

                    let weather = `${result['data']['weather']['weather'][0]['description']}. Current temperature is 
                    ${Math.floor(result['data']['weather']['main']['temp'] - 273)} &#8451; `

    
                   let info = ` <h2>${result['data']['name']}</h2>
                   <img style="width:100px; height: 100px;" alt="${result['data']['name']}" src="${result['data']['flag']}" /><br />
                  Capital City: ${result['data']['capital']}<br />
                   Population: ${result['data']['population']}<br />
                   Currency: ${result['data']['currencies'][0]['name']}  ${result['data']['currencies'][0]['symbol']}. 
                    1 US Dollar is equal to ${result['data']['rate']['rates'][result['data']['currencies'][0]['code']]} ${result['data']['currencies'][0]['code']}<br />
                   Current Weather: ${weather} <br />
                   Wikipedia Link: <a target="_blank" href="https://en.wikipedia.org/wiki/${result['data']['name']}">
                    ${result['data']['name']}</a>
                    `
                        
    
               

            console.log(info);
    
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                
            }
        }); 
    
    
    });



    //Countries GeoJson


    $('#viewcountry').click(function() {
        let country = $('#country').val();
        
        
    
        console.log(country);
    
    
        $.ajax({
            url: "php/borders.php",
            type: 'POST',
            dataType: 'json',
            
            success: function(result) {
    
                
    
                if (result.status.name == "ok") {
    
                   let allCountries = result.data['features']
                   for(let i = 0; i < allCountries.length; i++){
                       
                       if(allCountries[i]['properties']['iso_a3'] == country){
                        L.geoJSON(allCountries[i]).addTo(mymap);
                        console.log(allCountries[i]);


                         //bounds for the map not working


                        /*let coordinates = allCountries[i]['geometry']['coordinates'];
                          
                          let bound1 = coordinates[0][0][0];
                          let bound2 = coordinates[coordinates.length - 1][coordinates[coordinates.length - 1].length - 1][0];
                          console.log(coordinates);
                            console.log(bound1);
                            console.log(bound2);
                                           
                          

                           mymap.fitBounds([bound1, bound2]);
                           */




                           //marker cluster icon copied from leaflet
                           /*
                           var greenIcon = L.icon({
    iconUrl: 'leaf-green.png',
    shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

                           L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);
                           */

                       }
                   }
                        
    
                  
    
                }
            
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
                
            }
        }); 
    
    
    });