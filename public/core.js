var filmList = angular.module('filmList', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all films and show them
    $scope.getFilms = function() {
      $http.get('/api/films')
          .success(function(data) {
              $scope.films = data;
              console.log(data);
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };
    $scope.getFilms();
    // when submitting the add form, send the text to the node API
    $scope.createFilm = function() {
        $http.post('/api/films', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so the user is ready to enter another
                //$scope.films = data;
                console.log(data);
                $scope.getFilms();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a film after checking it
    $scope.deleteFilm = function(id) {
        $http.delete('/api/films/' + id)
            .success(function(data) {
                $scope.getFilms();
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
