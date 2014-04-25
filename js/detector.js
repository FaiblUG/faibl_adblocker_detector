window.faiblAdBlockDetector = (function(window, document) {
  'use strict';


  /*************** PUBLIC INTERFACE ************************/

  var that = {
    detect: detect,
    initialize: initialize
  };


  /*************** PRIVATE SCOPE ************************/

  var config;

  function initialize(_config) {
    config = _config;

    if (config.callback && typeof config.callback === 'function') {
      detect(config.callback);
    }
  }

  function detect(callback) {
    detectViaDom(callback);
  }

  function detectViaDom(callback) {
    var blacklistedClassNames = ['isAd', 'contentad', 'google_ad', 'googleAdsense', 'googleAd300x250', 'insertad', 'header-ad-wrapper', 'homeAd', 'homeAd2', 'iframe-ads', 'item-advertising', 'leaderAdvert', 'horizontalAd', 'horizontal_ads', 'idGoogleAdsense'];

    testDomStyle(blacklistedClassNames[Math.floor(Math.random() * blacklistedClassNames.length)], function(adBlockerEnabled) {
      if (adBlockerEnabled) {
        //run test twice to avoid false positives because of accidentally matching site css styles:
        testDomStyle(blacklistedClassNames[Math.floor(Math.random() * blacklistedClassNames.length)], callback);
      }
      else {
        callback(false);
      }
    });
  }

  /**
   * Tests for the visibility of an element with certain "badword" css classses
   * This test executes a lot faster than the "testViaScript" alternative.
   */
  function testDomStyle(className, callback, iterationCounter, $el) {
    var $body;

    iterationCounter = iterationCounter || 0;

    if ($el === undefined) {
      $body = document.getElementsByTagName('body')[0];

      if (!$body) {
        detectViaScript(callback);

        return;
      }

      $el = document.createElement('div');
      $body.appendChild($el);

      $el.innerHTML = 'test';
      $el.style.position = 'absolute';
      $el.style.left = '-200px';
      $el.className = className;
    }

    setTimeout(function() {
      if (getComputedStyleProperty($el, 'display') === 'none' || getComputedStyleProperty($el, 'visibility') === 'hidden' || $el.offsetWidth === 0 || $el.offsetHeight === 0) {
        callback(true);
        $el.parentNode.removeChild($el);
      }
      else {
        if (iterationCounter < 5) {
          setTimeout(function() { testDomStyle(className, callback, iterationCounter + 1, $el); }, 20);
        }
        else {
          //DOM Style testing is prone to errors:
          //- Simple Ad Block for Internet Explorer hides the elements only after the window.onload event was fired but it is hard to tell
          //  if the window.onload has already fired in an asynchronously loaded script like this one
          //
          //Conclusion: additionally execute the script-based test jsut to be sure:
          detectViaScript(callback);
          $el.parentNode.removeChild($el);
        }
      }
    }, 50);
  }

  function getComputedStyleProperty($el, propertyName, propertyNameCamelCase) {
    if (window.getComputedStyle) {
      return document.defaultView.getComputedStyle($el, null).getPropertyValue(propertyName);
    }
    else if ($el.currentStyle) {
      return $el.currentStyle[propertyName] || $el.currentStyle[propertyNameCamelCase];
    }
  }

  /**
   * Test if a script with a "badword" filename is refused to load.
   *
   * This test should be used as a fallback test if the faster test "testDomStyle"
   * is not supported by the viewing browser or if the "testDomStyle" result is ambigous.
   */
  function detectViaScript(callback) {
    var testUrl = config.urlRoot+'js/advertisement.js?http%3A%2F%2Fad.de.doubleclick.net%2Fadj%2F';
    var head = document.getElementsByTagName("head")[0];
    var $script = document.createElement('script');

    $script.src = testUrl;
    $script.type = 'text/javascript';

    $script.onload = function() { callback(false); };
    $script.onerror = function() { callback(true); };

    var $firstScript = document.getElementsByTagName('script')[0];
    $firstScript.parentNode.insertBefore($script, $firstScript);
  }

  return that;
})(window, document);
