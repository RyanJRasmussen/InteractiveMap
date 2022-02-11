async function main(coords){
    //map creation
    let interactiveMap = L.map('map', {
        center: coords,
        zoom: 12,
    });
    
    //adding the tile that map shows up on
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: '10',
    }).addTo(interactiveMap)

    var userMarker = L.marker(coords).addTo(interactiveMap);
    userMarker.bindPopup("You are here");

    //Logic to add pins with nearby shop locations
    let userShopOptions = ['', 'coffee', 'restaurant', 'hotel', 'market']
    let shopValue = 0;

    //turning coords into string data type, removing them from the array as separate strings with destructuring
    let coordsForFetch = coords.map(String)
    let [lat, long] = coordsForFetch
    
    const options = {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        Authorization: ''
        }
    };
    //selecting the select tag in DOM
    let shopSelection = document.querySelector('select')
    //event listener that hears change in the event tag

    shopSelection.addEventListener('change', async () => {
        await fetchLocations()
        .then((value) => {
        })
    })

    let marker1;
    let marker2;
    let marker3;
    let marker4;
    let marker5;

    async function fetchLocations(){
        let userMarker = L.marker(coords).addTo(interactiveMap);
        interactiveMap.removeLayer(userMarker)
        userMarker.bindPopup("You are here");

    
        let value = shopSelection.value;
        shopValue = value

        let usefulLocationCoords = [];
        let usefulLocationNames = [];

        let fetchURL = 'https://api.foursquare.com/v3/places/search?query=' + userShopOptions[shopValue] + '&ll='+ lat + '%2C' + long + '&radius=100000&limit=5'

        if(userShopOptions[shopValue] != ''){
            let dataFetch = await fetch(fetchURL, options)
            let response = await dataFetch.json()
            .catch(err => console.error(err));
            console.log('Working')
            for(let i = 0; i < 5; i++){
                usefulLocationCoords.push([response.results[i].geocodes.main.latitude, response.results[i].geocodes.main.longitude])
                usefulLocationNames.push(response.results[i].name)
            }
            marker1 = L.marker(usefulLocationCoords[0]).addTo(interactiveMap).bindPopup(usefulLocationNames[0])
            marker2 = L.marker(usefulLocationCoords[1]).addTo(interactiveMap).bindPopup(usefulLocationNames[1])
            marker3 = L.marker(usefulLocationCoords[2]).addTo(interactiveMap).bindPopup(usefulLocationNames[2])
            marker4 = L.marker(usefulLocationCoords[3]).addTo(interactiveMap).bindPopup(usefulLocationNames[3])
            marker5 = L.marker(usefulLocationCoords[4]).addTo(interactiveMap).bindPopup(usefulLocationNames[4])

            return [usefulLocationCoords, usefulLocationNames]
        } else if(userShopOptions[shopValue] === ''){
            interactiveMap.removeLayer(marker1)
            interactiveMap.removeLayer(marker2)
            interactiveMap.removeLayer(marker3)
            interactiveMap.removeLayer(marker4)
            interactiveMap.removeLayer(marker5)

        }
    }
}

async function getUserLocation(){
    const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [position.coords.latitude, position.coords.longitude]
}

window.onload = async () => {
    const coordinates = await getUserLocation()
    main(coordinates)
}

