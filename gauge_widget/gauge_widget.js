import _ from 'lodash';
import c3 from 'c3';

function GaugeWidgetCtrl($scope, DashboardPollService) {
  $scope.data = undefined;
  $scope.chartLoaded = false;
  $scope.gaugeError = false;
  const ROW_HEIGHT = 26;
  $scope.defaults = {
    bindto: '#chart-' + $scope.config.id,
    height: $scope.config.sizeY * ROW_HEIGHT
  };
  $scope.$on('newAPIData', function() {
    let newApiResponse = DashboardPollService.results[$scope.config.id];
    if (newApiResponse.status !== 200) {
      console.error($scope.config.id, " failed to load.");
      $scope.gaugeError = true;
      return;
    }
    if ($scope.chartLoaded === false) {
      let config = $scope.config.presentation.gaugeConfig;
      config.bindto = $scope.defaults.bindto;
      config.size.height = $scope.defaults.height;
      $scope.chart = c3.generate(config);
      $scope.chartLoaded = true;
    }
    let newWidgetData = newApiResponse.results[$scope.config.query.responseKey];
    $scope.chart.load({
      columns: [
        ['data', newWidgetData]
      ]
    });
    $scope.gaugeError = false;
  });
}
GaugeWidgetCtrl.$inject = ['$scope', 'DashboardPollService'];

GaugeWidgetCtrl.$inject = ['$scope', 'DashboardPollService', '$timeout'];

function GaugeWidget() {
  return {
    restrict: 'EA',
    templateUrl: 'js/directives/gauge_widget/gauge_widget.html',
    scope: {
      config: '='
    },
    controller: GaugeWidgetCtrl
  };
}

export default {
  directiveName: 'gaugeWidget',
  directiveFn: GaugeWidget,
  directiveCtrlName: 'GaugeWidgetCtrl',
  directiveCtrl: GaugeWidgetCtrl
};
