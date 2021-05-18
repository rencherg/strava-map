const auth_link = "https://www.strava.com/oauth/token"

function displayData(data){

    document.getElementById("data").innerHTML = data;

}


function getActivites(res){

    const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${res.access_token}`
    fetch(activities_link)
        .then((res) => res.json())
        .then(function (data){

            let map = L.map('map').setView([40.326696, -111.696915], 11);

            //openstreetmap code
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
               attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               }).addTo(map);


            //google maps code
            /*L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
            }).addTo(map);*/


            for(let i=0; i<data.length; i++){

                if(data[i].type === 'Run') {

                    var coordinates = L.Polyline.fromEncoded(data[i].map.summary_polyline).getLatLngs()

                    const activityDate = (data[i].start_date_local).slice(0, 10)
                    const distMeters = data[i].distance
                    let distMiles = distMeters / 1609.0;
                    distMiles *= 100
                    distMiles = Math.round(distMiles)
                    distMiles /= 100
                    //console.log('Distance in Miles:', Math.round(distMiles * 100) / 100)
                    const activitySeconds = data[i].moving_time
                    const activityHours = activitySeconds / 3600.0
                    const activityPace = (distMiles / activityHours)

                    let newPolyline = L.polyline(
                        coordinates,
                        {
                            color: "green",
                            weight: 5,
                            opacity: .7,
                            lineJoin: 'round'
                        })
                        .addTo(map)
                        .bindPopup('<b>Run</b><br><p>' + activityDate + '</p><p>' + distMiles + ' miles</p>')

                    newPolyline.on('click', function(){

                        displayData('<b>Run</b><p>' + activityDate + '</p><p>' + distMiles + ' miles</p>')

                    })

                }

                else if(data[i].type === 'Ride') {

                    let coordinates = L.Polyline.fromEncoded(data[i].map.summary_polyline).getLatLngs()

                    const activityDate = (data[i].start_date_local).slice(0, 10)
                    const distMeters = data[i].distance
                    let distMiles = distMeters / 1609.0;
                    distMiles *= 100
                    distMiles = Math.round(distMiles)
                    distMiles /= 100
                    //console.log('Distance in Miles:', Math.round(distMiles * 100) / 100)
                    const activitySeconds = data[i].moving_time
                    const activityHours = activitySeconds / 3600.0
                    const activityPace = (distMiles / activityHours)

                    let newPolyline = L.polyline(
                        coordinates,
                        {
                            color: "blue",
                            weight: 5,
                            opacity: .7,
                            lineJoin: 'round'
                        })
                        .addTo(map)
                        .bindPopup('<b>Bike</b><p>' + activityDate + '</p><p>' + distMiles + ' miles</p>')

                    newPolyline.on('click', function(){

                        displayData('<b>Bike</b><br><p>' + activityDate + '</p><p>' + distMiles + ' miles</p>')

                    })


                }


            }


        })
}


function reAuthorize() {
    fetch(auth_link, {
        method: 'post',

        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({

            client_id: 'xxx',//<client_id>
            client_secret: 'xxx',//<client secret>
            refresh_token: 'xxx',//<refresh_token>
            grant_type: 'refresh_token'

        })

    }).then(res => res.json())
        .then(res => getActivites(res))
}

reAuthorize()
