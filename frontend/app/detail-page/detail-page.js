'use strict';

angular.module('myApp.detail-page', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/detail-page/:goalId', {
            templateUrl: 'detail-page/detail-page.html',
            controller: 'DetailPageCtrl'
        });
    }])

    .controller('DetailPageCtrl', ["Restangular", "$scope", "$routeParams", function (Restangular, $scope, $routeParams) {
        var goalId = $routeParams.goalId;
        Restangular.one("goals", goalId).get().then(function (goal) {
            $scope.goal = goal
        });

        $scope.inactiveButtons = "../app/partials/inactive-buttons.html";
        $scope.activeButtons = "../app/partials/active-buttons.html";
        $scope.completeButtons = "../app/partials/complete-buttons.html";

//        SECTION I'M WORKING ON TO ADD STEP
        $scope.stepAdd = function (keyEvent, goal, step) {
            if (keyEvent.which === 13) {

                var childGoal = {
                    "goal": goal.id,
                    "step": step,
                    "timeFrame": 1
                };

                Restangular.one("child-goals/").customPOST(childGoal).then(function (step) {
                    goal.step = step;
                });
                goal.addStepEdit = false;
            }
        };

//        END OF SECTION I'M WORKING ON


        $scope.statusChange = function (childGoal, status) {
            childGoal.status = status;

            Restangular.one("child-goals", childGoal.id).customPUT(childGoal).then(function (chGoal) {
                childGoal = chGoal;
            });
        };

        $scope.completeChange = function (childGoal, complete) {
            childGoal.complete = complete;

            Restangular.one("child-goals", childGoal.id).customPUT(childGoal).then(function (chGoal) {
                childGoal = chGoal;
            });
        }

        $scope.stepChange = function (keyEvent, childGoal) {

            if (keyEvent.which === 13) {

                Restangular.one("child-goals", childGoal.id).customPUT(childGoal).then(function (chGoal) {
                    childGoal = chGoal;
                });

                childGoal.editing = false;
            }
        };

        $scope.activeGoalsEmpty = function (goal) {
            if ($scope.hasOwnProperty('goal')) {
                return $scope.goal.child_goals.filter(returnStatus).length;
            }
        };

        var returnStatus = function (elem) {
            return elem.status && !elem.complete
        }

        $scope.inactiveGoalsEmpty = function (goal) {
            if ($scope.hasOwnProperty('goal')) {
                return $scope.goal.child_goals.filter(returnStatus2).length;
            }
        };

        var returnStatus2 = function (elem) {
            return elem.status
        }

        $scope.completeGoalsEmpty = function (goal) {
            if ($scope.hasOwnProperty('goal')) {
                return $scope.goal.child_goals.filter(returnStatus3).length;
            }
        };

        var returnStatus3 = function (elem) {
            return elem.complete
        }

    }]);