import { getGlobal } from 'src/prebidGlobal';

const prebid = getGlobal();

/**
 * This file serves as the plugin point for adserver module functionality.
 *
 * Ad Server modules should call {@link registerAdserver} to connect into prebid-core.
 *
 * If publishers bundle Prebid with a single Ad Server module, they'll be able to interact with it
 * through the properties and functions on `pbjs.adserver`.
 *
 * If publishers bundle with more than one Ad Server, they'll need to interact with them through
 * `pbjs.adservers.{adServerCode}`, where the adServerCode is defined by the ad server itself.
 */

/**
 * @typedef {Object} CachedVideoBid
 *
 * @property {string} videoCacheId The ID which can be used to retrieve this video from prebid-server.
 *   This is the same ID given to the callback in the videoCache's store function.
 */

/**
 * @function VideoAdUrlBuilder
 *
 * @param {CachedVideoBid} bid The winning Bid which the ad server should show, assuming it beats out
 *   the competition.
 *
 * @param [Object] options Miscellaneous Ad-Server-specific options. This object will have different
 *   properties depending on the specific ad server supported. For more information, see the docs
 *   inside the ad server module you're using.
 *
 * @return {string} A URL which can be passed into the Video player to play an ad.
 *   This should call the Ad Server, and return the ad which should be played (letting the
 *   given bid compete alongside the rest of the demand).
 */

/**
 * @typedef {Object} VideoSupport
 *
 * @property {string} code The identifying code for this adserver. Note that this contributes to
 *   the user-facing API. For example, if the adserver code is 'dfp', and the Prebid bundle contains two
 *   or more ad server modules, then publishers will access its functions through 'pbjs.adservers.dfp'.
 *
 * @method {VideoAdUrlBuilder} buildVideoAdUrl
 */

/**
 * Prepares a namespace on object so that utility functions can be added to it.
 *
 * If this is the only code we've seen, attach functionality to $$PREBID_GLOBAL$$.adServer.
 * If we've seen any other codes, attach functionality to $$PREBID_GLOBAL$$.adServers[code].
 *
 * @param {object} object The object where this function should manage namespaces.
 * @param {string} code The code for this ad server.
 * @return {object} An object where functions for dealing with this ad server can be added.
 */
function prepareNamespaceIn(object, code) {
  if (object.adServer && object.adServer.code !== code) {
    object.adServers = { };
    object.adServers[object.adServer.code] = object.adServer;
    delete object.adServer.code;
    delete object.adServer;
  }

  if (object.adServer) {
    return object.adServer;
  }
  if (object.adServers) {
    if (!object.adServers[code]) {
      object.adServers[code] = { };
    }
    return object.adServers[code];
  }
  else {
    object.adServer = { code };
    return object.adServer;
  }
}

/**
 * Enable video support for the Ad Server.
 *
 * @property {string} code The identifying code for this adserver.
 * @property {VideoSupport} videoSupport An object with the functions needed to support video in Prebid.
 */
export function registerVideoSupport(code, videoSupport) {
  prepareNamespaceIn(prebid, code).buildVideoAdUrl = videoSupport.buildVideoAdUrl;
}