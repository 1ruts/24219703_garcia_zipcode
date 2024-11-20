const userID = ''; // Add your USPS API User ID
let zip5 = document.getElementById('zip5');
let city = document.getElementById('city');
let state = document.getElementById('state');
let invalid = document.getElementById('invalid');

const loadXMLDoc = function() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let address = {
                zip: null,
                city: null,
                state: null,
                error: null
            };

            address = getXMLDoc(address, this.responseText);
            city.value = address.city;
            state.value = address.state;
            invalid.innerHTML = address.error;

            if (address.error == null) {
                zip5.setAttribute('class', 'form-control');
            } else {
                zip5.setAttribute('class', 'form-control is-invalid');
            }
        }
    };

    xhttp.open('GET', createRequest(), true);
    xhttp.send();
};

const createRequest = function() {
    let req = 'https://secure.shippingapis.com/ShippingApi.dll?API=CityStateLookup&XML=';
    req += '<CityStateLookupRequest USERID="' + userID + '">';
    req += '<ZipCode ID="0">';
    req += '<Zip5>' + zip5.value + '</Zip5>';
    req += '</ZipCode>';
    req += '</CityStateLookupRequest>';
    return req;
};

const getXMLDoc = function(addr, res) {
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(res, "text/xml");
    if (typeof(xmlDoc.getElementsByTagName("City")[0]) != 'undefined') {
        addr.city = xmlDoc.getElementsByTagName("City")[0].childNodes[0].nodeValue;
        addr.state = xmlDoc.getElementsByTagName("State")[0].childNodes[0].nodeValue;
        addr.error = null;
    } else {
        addr.city = null;
        addr.state = null;
        addr.error = xmlDoc.getElementsByTagName("Description")[0].childNodes[0].nodeValue;
    }
    return addr;
};
