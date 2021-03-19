


/*$('#viewCountry').click(function() {
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
                     
                    var myLayer = L.geoJSON().addTo(map);
myLayer.addData(geojsonFeature);

                    or
                      
                      L.geoJSON(allCountries[i]).addTo(mymap);
                    
                       map.fitBounds([
    [40.712, -74.227],
    [40.774, -74.125]
]);
                   }
               }
					

              

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            
        }
    }); 


});


*/





