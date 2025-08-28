
const apiKey = '325ef0ebf9254f67b2534840a7726dbe'; // OpenCage API Key

      function loadMapLink(streetName, mapDivId) {
        $.ajax({
          url: 'https://api.opencagedata.com/geocode/v1/json',
          data: { key: apiKey, q: streetName, limit: 1 },
          success: function (data) {
            if (data.results && data.results.length > 0) {
              const lat = data.results[0].geometry.lat;
              const lng = data.results[0].geometry.lng;
              const mapLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
              $('#' + mapDivId).html(`<a href="${mapLink}" target="_blank">
          <button class="btn btn-primary">View on Map</button>
        </a>`);
            } else {
              $('#' + mapDivId).html('Location not found.');
            }
          },
          error: function () {
            $('#' + mapDivId).html('Error fetching location.');
          }
        });
      }

      $(document).ready(function () {
        loadMapLink("Jalan Alor Kuala Lumpur", "jalanAlorMapBtn");
        loadMapLink("Armenian Street George Town Penang", "armenianMapBtn");
        loadMapLink("Concubine Lane Ipoh", "concubineMapBtn");
        loadMapLink("Jonker Street Melaka", "jonkerMapBtn");
        loadMapLink("Jalan Masjid India Kuala Lumpur", "masjidIndiaMapBtn");
        loadMapLink("Gaya Street Kota Kinabalu", "gayaMapBtn");
      });