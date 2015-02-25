faibl_adblocker_detector
========================

AdBlocker detection script used by faibl.org


Installation
------------

Clone the repository within a folder of your website that is reachable via http:

    git clone https://github.com/FaiblUG/faibl_adblocker_detector.git

Or just run from your project root:

    bower install faibl_adblocker_detector

Usage
-----

To see a simple example how our AdBlocker detection script can be used, see [demo.html](demo.html).

What you will do with the information (AdBlocker enabled/ AdBlocker not enabled) is totally up to you and can be controlled by a javascript callback method.


How does the test work?
-----------------------
 * The first test is based on commonly black-listed css class names (e.g. 'isAd', 'google_ad', 'googleAdsense' etc.)
   We insert a temporary div element and randomly assign one of those class names. If the element is hidden, we repeat the test with another randomly selected class name to avoid false positives. If the element is still hidden, we assume an active AdBlocker.
 * If we cannot detect an active AdBlocker based on the class names, we conduct another test where we fetch a commonly blacklisted url (e.g. dist/advertisement.js?http%3A%2F%2Fad.de.doubleclick.net%2Fadj%2F)
   If the script cannot be loaded, we assuem an active AdBlocker.
 * If we still could not detect an active AdBlocker, we assume that there is no active AdBlocker
 