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

        var globe = new Globe({id: "canvasOne"});
        var controls = new Controls(globe);
        var gInterface = new GlobeInterface(globe);
        // var heatmapPanel = new HeatmapPanel(globe, gInterface.globe.navigator, gInterface.globe.worldWindowController, controls);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(globe);

        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Web Map Service information from NASA's Near Earth Observations WMS
        var serviceAddress = "http://cs.aworldbridgelabs.com:8080/geoserver/ows?service=WMS&request=GetCapabilities&version=1.1.1";

        var layerName = [];
        var preloadLayer = [];

        var layers = globe.layers;

        $(document).ready(function () {
            $.getJSON('LayerNCC.json', function(data){
                console.log(data.length);
                for (var k = 0; k < data.length; k++) {

                    // alert (data[0].Color);

                    var colorAttribute = data[k].Color;
                    var cAtwo = colorAttribute.split(" ");
                    // console.log(cAtwo);

                    var location = data[k].Latitude_and_Longitude_Decimal;
                    var ptwo = location.split(",");
                    // console.log(ptwo);

                    var LayerName = data[k].Layer_Name;
                    // console.log(LayerName);

                    var sitename = data[k].Site_Name;

                    var sitedesc = pmInfo[k].Site_Description;




                    Placemark_Creation(cAtwo, ptwo, LayerName);

                }

                console.log(layers);
            });

            $(".wmsLayer").each(function (i) {
                preloadLayer[i] = $(this).val();
            });

            var strs = preloadLayer + '';

            layerName = strs.split(",");

            $('.wmsLayer').click(function(){
                console.log (layers);
                for (var a = 0; a < layers.length; a++) {
                    if ($('.wmsLayer').is(":checkbox:checked")) {
                        $(':checkbox:checked').each(function () {
                            if (layers[a].displayName === $(this).val()) {
                                layers[a].enabled = true;
                            }
                        });
                    }

                    if($('.wmsLayer').is(":not(:checked)")) {
                        $(":checkbox:not(:checked)").each(function (i) {
                            if (layers[a].displayName === $(this).val()) {
                                layers[a].enabled = false;
                            }
                        })
                    }
                }
            });

            $('.placemarkLayer').click(function(){

                var val1;
                if ($('.placemarkLayer').is(":checkbox:checked")) {
                    // alert("hi");

                    $(':checkbox:checked').each(function () {
                        val1 = $(this).val();
                        // var str = val+'';
                        // val = str.split(",");
                        console.log(val1);
                        for (var a = 0; a < layers.length; a++) {

                            if (layers[a].displayName === val1) {

                                layers[a].enabled = true;

                            }
                        }
                    });
                }

                if($('.placemarkLayer').is(":not(:checked)")) {
                    // console.log("enable:false");
                    var val2;
                    $(":checkbox:not(:checked)").each(function (i) {
                        val2 = $(this).val();

                        // console.log(str);
                        // console.log(val2[i]);


                        // console.log(val);
                        // console.log("s"+val2s[a].displayName);

                        for (var a = 0; a < layers.length; a++) {
                            if (layers[a].displayName === val2) {

                                layers[a].enabled = false;
                                // console.log("str: " + layers[a].displayName);
                                // console.log(layers[a]);
                            }
                        }
                    });
                }
            });
        });

        var createWMSLayer = function (xmlDom) {
            console.log (layerName);

            // Create a WmsCapabilities object from the XML DOM
            var wms = new WorldWind.WmsCapabilities(xmlDom);
            // Retrieve a WmsLayerCapabilities object by the desired layer name
            for (var n = 22; n < layerName.length; n++) {
                var wmsLayerCapabilities = wms.getNamedLayer(layerName[n]);
                // wmsLayerCapabilities.title = layerName[n];
                // Form a configuration object from the WmsLayerCapability object
                var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
                console.log(n + "Layer: " + layerName[n]);
                // // Modify the configuration objects title property to a more user friendly title
                // // wmsConfig.title = layerName[n];
                // // Create the WMS Layer from the configuration object
                var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
                // // Add the layers to WorldWind and update the layer manager
                globe.addLayer(wmsLayer);
                // layerManager.synchronizeLayerList();
            }
        };

        // Called if an error occurs during WMS Capabilities document retrieval
        var logError = function (jqXhr, text, exception) {
            console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
        };

        $.get(serviceAddress).done(createWMSLayer).fail(logError);

        var Placemark_Creation = function (RGB, latandlong, LayerName) {

            var placemark;
            var highlightAttributes;
            var placemarkLayer = new WorldWind.RenderableLayer(LayerName);
            var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
// console.log(latandlong[0]);

// Create the custom image for the placemark.

            var canvas = document.createElement("canvas"),
                ctx2d = canvas.getContext("2d"),
                size = 45, c = size / 2 - 0.5, innerRadius = 3, outerRadius = 10;

            canvas.width = size;
            canvas.height = size;
//This is the color of the placeholder and appearance (Most likely)
//             console.log(RGB);

            var gradient = ctx2d.createRadialGradient(c, c, innerRadius, c, c, outerRadius);
            gradient.addColorStop(0, RGB[0]);
            gradient.addColorStop(0.5, RGB[1]);
            gradient.addColorStop(1, RGB[2]);


            ctx2d.fillStyle = gradient;
            ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
            ctx2d.fill();

            // Set up the common placemark attributes.
            placemarkAttributes.imageScale = 0.75; //placemark size!
            placemarkAttributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 0.5);
            placemarkAttributes.imageColor = WorldWind.Color.WHITE;


            placemark = new WorldWind.Placemark(new WorldWind.Position(latandlong[0], latandlong[1], 1e2), true, null);
            // placemark.label = "Placemark" + "\n"
            placemark.displayName = LayerName;
            //     + "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n"
            //     + "Lon " + placemark.position.longitude.toPrecision(5).toString();
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            // Create the placemark attributes for this placemark. Note that the attributes differ only by their
            // image URL.
            placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
            placemark.attributes = placemarkAttributes;

            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale.
            highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            highlightAttributes.imageScale = 1.2;
            placemark.highlightAttributes = highlightAttributes;

            // Add the placemark to the layer.
            placemarkLayer.addRenderable(placemark);
            placemarkLayer.enabled = false;
            // console.log(placemarkLayer);
            // console.log(placemark);
            globe.addLayer(placemarkLayer);
        };

        var highlightedItems= [];

        var handlePick = function (o) {

            // alert("ttyy");
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked items

            // De-highlight any previously highlighted placemarks.
            for (var h = 0; h < highlightedItems.length; h++) {
                highlightedItems[h].highlighted = false;
            }
            highlightedItems = [];

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = globe .pick(globe.canvasCoordinates(x, y));
            if (pickList.objects.length > 0) {
                redrawRequired = true;
            }

            // Highlight the items picked by simply setting their highlight flag to true.
            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    pickList.objects[p].userObject.highlighted = true;

                    // Keep track of highlighted items in order to de-highlight them later.
                    highlightedItems.push(pickList.objects[p].userObject);

                    // Detect whether the placemark's label was picked. If so, the "labelPicked" property is true.
                    // If instead the user picked the placemark's image, the "labelPicked" property is false.
                    // Applications might use this information to determine whether the user wants to edit the label
                    // or is merely picking the placemark as a whole.
                    if (pickList.objects[p].labelPicked) {
                        console.log("Label picked");
                    }
                }
            }

            // Update the window if we changed anything.
            if (redrawRequired) {
                globe.redraw(); // redraw to make the highlighting changes take effect on the screen
            }
        };


        var handleMouseCLK = function (a)   {
            var x = a.clientX,
                y = a.clientY;
            var pickListCLK = [];
            pickListCLK = globe.pick(globe.canvasCoordinates(x, y));
            for (var m = 0; m < pickListCLK.objects.length; m++) {
                var pickedPM = pickListCLK.objects[m].userObject;
                if (pickedPM instanceof WorldWind.Placemark) {

                    // sitePopUp(pickedPM.label);
                    // alert(pickedPM.label);
                    sitePopUp(pickedPM.label);


                    $(document).ready(function () {

                        var modal = document.getElementById('popupBox');
                        var span = document.getElementById('closeIt');

                        modal.style.display = "block";


                        span.onclick = function () {
                            modal.style.display = "none";

                            window.onclick = function (event) {
                                if (event.target == modal) {
                                    modal.style.display = "none";

                                }
                            }
                        }
                    });
                }
            }
        };
        var sitePopUp = function (id) {
            var popupBodyItem = $("#popupBody");


            for (var k = 0, datas = data.length; k < lengths; k++) {

                if (layers[k].sitename === id) {

                    popupBodyItem.children().remove();
                    // alert(infobox[k].sitename);
                    //     alert("hi");
                    var popupBodyName = $('<p class="site-name"><h4>' + pmInfo[k].sitename + '</h4></p>');
                    var popupBodyDesc = $('<p class="site-description">' + pmInfo[k].sitedesc + '</p><br>');

                    popupBodyItem.append(popupBodyName);
                    popupBodyItem.append(popupBodyDesc);
                    // break
                }
            }
        };

        globe.addEventListener("mousemove", handlePick);

        globe.addEventListener("click", sitePopUp);

        globe.addEventListener("click", handleMouseCLK);

    });



//
// 1)Create a placemark
// 2) Create a new layer and display name for each placemark
// 3) Link the toggle switch to each layer
//
//   1) Select the toggle switch using $(jquery class locator)
//   2)Attach to a function that links the toggle switch to each layer
//   3) Use console.log to check your work



