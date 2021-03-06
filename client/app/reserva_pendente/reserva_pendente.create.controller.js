
angular.module('finalnodeApp').controller('ReservaPendenteCreateCtrl', function($scope, $http, $location, Auth) {
    var URI_RECURSO = '/api/recursos/';

    var URI_USER = '/api/users/';

    var PRIMEIRO_INDICE = 0;

    $scope.recursosEsportivos = [];

    $scope.reserva_pendente = { qtdPessoas: 0, users: []};

    $scope.errors = {};

    $scope.horariosDisponiveis = [];

    $scope.qtdMinimaPessoas = 0;
    $scope.reserva_pendente.qtdPessoas = 0;
    
    $scope.usuariosSelecionados = [];

    $scope.diminuiCount = function(){
      if ($scope.reserva_pendente.qtdPessoas > 0){
        $scope.reserva_pendente.qtdPessoas--;
      }
    }

    $scope.aumentaCount = function(){
      $scope.reserva_pendente.qtdPessoas++;
    }

    $scope.selecionaHorarios = function(id) {
        var recurso = _.where($scope.recursosEsportivos, { _id: id })[PRIMEIRO_INDICE];
        $scope.horariosDisponiveis = recurso.horariosDisponiveis;
        $scope.qtdMinimaPessoas = recurso.minPessoas;
    };

    $scope.add = function(form) {
        $scope.submitted = true;
        if ($scope.reserva_pendente === '') {
            return;
        }
        $scope.reserva_pendente.hora = parseInt($scope.reserva_pendente.hora, 10);
        angular.forEach($scope.usuariosSelecionados, function(user) {
            $scope.reserva_pendente.users.push(user._id);
        });
        $http.post('/api/reservasPendentes', $scope.reserva_pendente).then(function() {
            $location.path('/reserva_pendente')
        }).catch(function(err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
                form[field].$setValidity('mongoose', false);
                $scope.errors[field] = error.message;
            });
        });
    };

    $scope.getUserSelected = function(val) {
        return $http.get(URI_USER, {
            params: {
                name: val
            }
        }).then(function(response) {
            return response.data.map(function(item) {
                return item;
            });
        });
    };

    $scope.onSelect = function($item, $model, $label) {
        if (_.findWhere($scope.usuariosSelecionados, $item) == null) {
            $scope.usuariosSelecionados.push($item);
        }
    };

    $scope.deleteUser = function(user) {
        var finded = _.findWhere($scope.usuariosSelecionados, user);
        $scope.usuariosSelecionados = _.without($scope.usuariosSelecionados, finded);
    };

    (function main() {
        $http.get(URI_RECURSO).success(function(recursos) {
            $scope.recursosEsportivos = recursos;
        });
    })();
});