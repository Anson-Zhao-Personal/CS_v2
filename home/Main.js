/*
* Copyright 2015-2017 WorldWind Contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

requirejs(['./WorldWindShim',
        './LayerManager',
        './OptionList',
        '../src/heatmap/GlobeInterface',
        '../src/heatmap/Globe',
        '../src/heatmap/Controls',
        '../src/heatmap/HeatmapPanel'],
    function (WorldWind,
              LayerManager,
              OptionList,
              GlobeInterface,
              Globe,
              Controls,
              HeatmapPanel) {
        "use strict";

        var globeID = "canvasOne";
        var globe = new Globe({id: globeID});
        var controls = new Controls(globe);
        var gInterface = new GlobeInterface(globe);

        // var heatmapPanel = new HeatmapPanel(globe, gInterface.globe.navigator, gInterface.globe.worldWindowController, controls);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(globe);

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Web Map Service information from NASA's Near Earth Observations WMS
        var serviceAddress = "http://cs.aworldbridgelabs.com:8080/geoserver/ows?service=WMS&request=GetCapabilities&version=1.1.1";
        // Named layer displaying Average Temperature data

        var layerName = [];
        var preloadLayer = [];

        var layers = globe.layers;

        $(document).ready(function () {

            $(".switch_right").each(function (i) {

                preloadLayer[i] = $(this).val();

            });

            var strs = preloadLayer + '';

            layerName = strs.split(",");

            // layerName = res.slice(0);
            // console.log(layerName);

            $('.switch_right').click(function(){
                // var val = [];
                if ($('.switch_right').is(":checkbox:checked")) {
                    $(':checkbox:checked').each(function () {
                        // selectL = $(this).val();
                        // var str = val+'';
                        // val = str.split(",");

                        for (var a = 0; a < layers.length; a++) {
                            if (layers[a].displayName === $(this).val()) {
                                layers[a].enabled = true;
                            }
                        }

                    });
                }

                if($('.switch_right').is(":not(:checked)")) {
                    $(":checkbox:not(:checked)").each(function (i) {
                        for (var a = 0; a < layers.length; a++) {
                            if (layers[a].displayName === $(this).val()) {
                                  layers[a].enabled = false;
                            }
                        }
                    })
                }
            });
        });

        var createWMSLayer = function (xmlDom) {
            // Create a WmsCapabilities object from the XML DOM
            var wms = new WorldWind.WmsCapabilities(xmlDom);
            // Retrieve a WmsLayerCapabilities object by the desired layer name
            // console.log(layerName);
            for (var n = 0; n < layerName.length; n++) {
                var NA = layerName[n];

                var wmsLayerCapabilities = wms.getNamedLayer(NA);
                // console.log(wmsLayerCapabilities);
                // Form a configuration object from the WmsLayerCapability object
                var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
                // Modify the configuration objects title property to a more user friendly title
                wmsConfig.title = NA;
                // Create the WMS Layer from the configuration object
                var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
                // Add the layers to WorldWind and update the layer manager
                globe.addLayer(wmsLayer);
                // layerManager.synchronizeLayerList();
            }

        };

        // Called if an error occurs during WMS Capabilities document retrieval
        var logError = function (jqXhr, text, exception) {
            console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
        };

        $.get(serviceAddress).done(createWMSLayer).fail(logError);

    });
