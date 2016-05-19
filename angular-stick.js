'use strict';

angular.module('stick', [])
  .directive('stick', function ($window, $document) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        var $section = element.parents(attrs.stickSection);
        var mode = attrs.stickMode || 'slide'; // slide, stay

        function init() {

          if (attrs.stickZIndex) {
            element.css('zIndex', attrs.stickZIndex);
          }

          adjust();
          update();

          angular.element($window).on('resize', adjust);
          $document.on('scroll', update);
          scope.$on('$destroy', destroy);
        }

        function destroy() {
          angular.element($window).off('resize', adjust);
          $document.off('scroll', update);
        }

        function setPosition(position) {
          if (element.css('position') !== position) {
            element.css('position', position);
          }
        }

        function setTop(top) {
          if (element.css('top') !== top) {
            element.css('top', top);
          }
        }

        function adjust() {
          element.width(element.parent().width());
        }

        function update() {

          switch (mode) {
          case 'stay':
            updateStay();
            break;
          case 'slide':
            updateSlide();
            break;
          default:
            updateSlide();
            break;
          }
        }

        function updateSlide() {
          var scrollTop = $document.scrollTop();
          var sectionOffsetTop = $section.offset().top;
          var sectionHeight = $section.height();
          var elementTop = 0;

          // Element doesn't reach bottom of window
          if (scrollTop < sectionOffsetTop - $window.innerHeight) {
            hide();
          }
          // Element doesn't reach top of window
          else if (scrollTop < sectionOffsetTop) {
            show();

            setPosition('relative');
            setTop('auto');
          }
          // Element doesn't reach bottom of section
          else if (scrollTop < sectionOffsetTop + sectionHeight - element.height()) {
            show();

            setPosition('fixed');
            setTop('0px');
          }
          // Element reached to bottom of section
          else if (scrollTop < sectionOffsetTop + sectionHeight ) {
            show();

            setPosition('absolute');

            elementTop = sectionHeight - element.height();
            elementTop = Math.max(0, elementTop);
            setTop(elementTop + 'px');
          }
          // Element section passed to top
          else {
            hide();
          }
        }

        function updateStay() {
          var scrollTop = $document.scrollTop();
          var sectionOffsetTop = $section.offset().top;
          var sectionHeight = $section.height();
          var elementTop = 0;

          // Element doesn't reach bottom of window
          if (scrollTop < sectionOffsetTop - $window.innerHeight) {
            hide();
          }
          // Element doesn't reach top of window
          else if (scrollTop < sectionOffsetTop) {
            show();

            setPosition('fixed');
            setTop('0px');
            clip(sectionOffsetTop - scrollTop + 'px', 'auto', 'auto', 'auto');
          }
          // Element doesn't reach bottom of section
          else if (scrollTop < sectionOffsetTop + sectionHeight - element.height()) {
            show();

            setPosition('fixed');
            setTop('0px');
            clip('auto', 'auto', 'auto', 'auto');
          }
          // Element reached to bottom of section
          else if (scrollTop < sectionOffsetTop + sectionHeight ) {
            show();

            setPosition('fixed');
            setTop('0px');
            clip('auto', 'auto', sectionOffsetTop + sectionHeight - scrollTop + 'px', 'auto');
          }
          // Element section passed to top
          else {
            hide();
          }
        }

        function clip(top, right, bottom, left) {
          element.css('clip', 'rect(' + top + ',' + right + ',' + bottom + ',' + left + ')');
        }

        function show() {
          if (!element.is(':visible')) {
            element.show();
            scope.$broadcast('slickShow');
          }
        }

        function hide() {
          if (element.is(':visible')) {
            element.hide();
          }
        }

        init();
      }
    };
  });
