// Get the list of players for a given tile/area for various purposes

var game = {

    _getPlayers: function (e) {

        // TODO make one get players and one getdata method for zones/tiles
        if (!localStorage.getItem('token')){

            alerts.showAlert(3, "info", 2000);

        }

        else {

            setTimeout(function () {

                var useToken = localStorage.getItem('token') || window.token,
                    title = e;

                $.ajax({

                    method: 'GET',
                    url: api.getPlayersList.url(id),
                    headers: {"Authorization": "Bearer" + useToken},
                    success: function (response) {
                        // Make call to list zone data
                    },
                    error: function (err) { 
                    }

                });

            }, 100);

        }

    },
    
    _printGameData: function () {},
    
};