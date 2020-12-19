import axios from 'axios';

const form = document.querySelector('form');
const addressInput = document.querySelector('#address')! as HTMLInputElement

const mapElement = document.querySelector('#map')! as HTMLDivElement

// Geocoding API Code - Access Key
const geoAPIKEY = '' // Get the API Access Key from the Position Stack Website

type GeocodeResponse = {
    data: { latitude: number; longitude: number }[];
    status: number;
    statusText: 'OK';
}

// Display Google Maps 
function displayGoogleMap(latitude: number, longitude: number): string {
    return `https://maps.google.com/?q=${latitude},${longitude}&output=embed`
}

const searchAddressHandler = (event: Event) => {
    event.preventDefault()
    const enteredAddress = addressInput.value

    axios.get<GeocodeResponse>(`http://api.positionstack.com/v1/forward?access_key=${geoAPIKEY}&query=${encodeURI(enteredAddress)}`).then(resp => {
        if (resp.data.data.length === 0)
            throw new Error('Could not fetch location !!!');

        if (resp.data.data[0].latitude) {
            const coordinates = {
                latitude: resp.data.data[0].latitude,
                longitude: resp.data.data[0].longitude
            };

            const iFrameElement = document.createElement('iframe');
            iFrameElement.src = displayGoogleMap(coordinates.latitude, coordinates.longitude)
            iFrameElement.width = mapElement.offsetWidth.toString();
            iFrameElement.height = mapElement.offsetHeight.toString();

            mapElement.innerHTML = ''
            mapElement.appendChild(iFrameElement)
        }

    }).catch(e => alert(e.message))
}

form?.addEventListener('submit', searchAddressHandler);