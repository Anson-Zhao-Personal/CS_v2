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
            $(".wmsLayer").each(function (i) {
                preloadLayer[i] = $(this).val();
            });

            var strs = preloadLayer + '';

            layerName = strs.split(",");

            $('.wmsLayer').click(function(){
                // console.log (layers);
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
        });

        var createWMSLayer = function (xmlDom) {
            // console.log (layerName);

            // Create a WmsCapabilities object from the XML DOM
            var wms = new WorldWind.WmsCapabilities(xmlDom);
            // Retrieve a WmsLayerCapabilities object by the desired layer name
            for (var n = 22; n < layerName.length; n++) {
                var wmsLayerCapabilities = wms.getNamedLayer(layerName[n]);
                // wmsLayerCapabilities.title = layerName[n];
                // Form a configuration object from the WmsLayerCapability object
                var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
                // console.log(n + "Layer: " + layerName[n]);
                // Modify the configuration objects title property to a more user friendly title
                // wmsConfig.title = layerName[n];
                // Create the WMS Layer from the configuration object
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

        //Charlie's Code

        // WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
        //
        // var globe = new WorldWind.WorldWindow("canvasOne");
        //
        // var LayerInfoGlobal = [];

        // All the Global Variables
        var laname,
            j,
            loca,
            locat,
            col,
            colo;

        var LayerInfo = [], CoordinateLatInfo = [], CoordinateLongInfo = [], listLoca = [];

        //This wmsLayer used to be switch_right but it's different on this project so I changed it
        $('.switch_right').click(function() {
            var CurrentToggleVal = $(this).val();
            console.log("Initial:" + layers.length);
            // console.log (layers);
            // console.log ("last displayN: " + layers[layers.length-1].displayName);
            // console.log((':checkbox:checked').length);

            // console.log($(this).prop('checked'));
            for (var b = 0; b < layers.length; b++) {
                if (layers[b].displayName === CurrentToggleVal) {

                    if ($(this).prop('checked')) {
                        console.log("open");
                        layers[b].enabled = true;

                        // $(':checkbox:checked').each(function () {
                        //
                        // });
                        // if (CurrentToggleVal === (":checkbox:checked")) {
                        //
                        // }

                    } else {
                        console.log("closed");
                        layers[b].enabled = false;

                    }
                    break;

                } else {
                    if (b === layers.length - 1) {
                        console.log("new");

                        $.getJSON("LayerNCC.json", function (layer) {
                            for (j = 0; j < layer.length; j++) {

                                if (CurrentToggleVal === layer[j].Layer_Name) {
                                    LayerInfo.push(layer[j]);
                                    loca = layer[j].Latitude_and_Longitude_Decimal;
                                    listLoca.push(loca);
                                    locat = loca.split(",");
                                    col = layer[j].Color;
                                    colo = col.split(" ");
                                    laname = layer[j].Layer_Name;
                                    CreatePlacemarkLayer(locat, colo, laname);
                                    console.log("Ending Loop:" + layers.length);
                                    // console.log ("displayN last: " + layers[layers.length-1].displayName);
                                }
                            }
                        });
                    }
                }
            }
            // for (var b = 0; b < layers.length; b++) {
            //     if ($('.switch_right').is(":checkbox:checked")) {
            //         console.log("yes");
            //         SelectedLayers.push(CurrentToggleVal);
            //         console.log(SelectedLayers);
            //         for (var t = 0; t < SelectedLayers.length; t++) {
            //             for (var b = 0; b < layers.length; b++) {
            //                 if (layers[b].displayName === SelectedLayers[t]) {
            //                     layers[b].enabled = true;
            //                 }
            //             }
            //         }
            //     } else if ($('.switch_right').is(":not(:checked)")) {
            //
            //         $(':checkbox:not(:checked)').each(function () {
            //             SelectedLayers.forEach(function (value, index) {
            //                 if (value === CurrentToggleVal) {
            //                     SelectedLayers.splice(index, 1);
            //                 }
            //             });
            //             console.log("Jesse likes hotdogs");
            //             delete SelectedLayers[CurrentToggleVal];
            //             console.log(SelectedLayers);
            //             for (var t = 0; t < layers.length; t++) {
            //                 if (layers[t].displayName === CurrentToggleVal) {
            //                     layers[t].enabled = false;
            //                 }
            //             }
            //         });
            //     }
            //     if (layers[t].displayName !== CurrentToggleVal) {
            //         $.getJSON("LayerNCC.json", function (layer) {
            //             // console.log (SelectedLayers.length);
            //             for (i = 0; i < SelectedLayers.length; i++) {
            //                 for (j = 0; j < layer.length; j++) {
            //                     if (SelectedLayers[i] === layer[j].Layer_Name) {
            //                         // console.log(SelectedLayers[i]);
            //                         LayerInfo.push(layer[j]);
            //                         loca = layer[j].Latitude_and_Longitude_Decimal;
            //                         locat = loca.split(",");
            //                         col = layer[j].Color;
            //                         colo = col.split(" ");
            //                         laname = layer[j].Layer_Name;
            //                         // console.log(laname);
            //                         CreatePlacemarkLayer(locat, colo, laname);
            //                     }
            //                 }
            //             }
            //         });
            //         // console.log(LayerInfo);
            //         // console.log(SelectedLayers);
            //     }
            // }
        });

        //This is creating the placemark layer and to connect the placemark to the switch
        var CreatePlacemarkLayer = function (location, pcolor, lname) {
            var placemark;
            var placemarkAttributes;
            var highlightAttributes;

            // Create the placemark.
            placemark = new WorldWind.Placemark(new WorldWind.Position(location[0], location[1], 1e2), false, null);
            //placemark.label = "This is a school" + SitesPL[i].SiteID; // NA,USA,1234
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            // Create the custom image for the placemark.
            var canvas = document.createElement("canvas"),
                ctx2d = canvas.getContext("2d"),
                size = 64, c = size / 2 - 0.5, innerRadius = 5, outerRadius = 20;

            canvas.width = size;
            canvas.height = size;

            var gradient = ctx2d.createRadialGradient(c, c, innerRadius, c, c, outerRadius);
            gradient.addColorStop(0, pcolor[0]);
            gradient.addColorStop(0.5, pcolor[1]);
            gradient.addColorStop(1, pcolor[2]);

            ctx2d.fillStyle = gradient;
            ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
            ctx2d.fill();

            // Create the placemark attributes for the placemark.
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
            // The line of code above used to have a (placemarkAttributes) in the PlacemarkAttributtes
            // Wrap the canvas created above in an ImageSource object to specify it as the placemark image source.
            placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
            placemark.attributes = placemarkAttributes;

            var placemarkLayer = new WorldWind.RenderableLayer(lname);
            // var PlacemarkSettings = //Set up the common placemark attributes.
            placemarkAttributes.imageScale = 0.35;
            placemarkAttributes.imageOffset = new WorldWind.Offset(
                WorldWind.OFFSET_FRACTION, 0.5,
                WorldWind.OFFSET_FRACTION, 0.5);
            placemarkAttributes.imageColor = WorldWind.Color.WHITE;

            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale. You could
            // instead vary the color, image, or other property to control the highlight representation.
            highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            highlightAttributes.imageScale = 50/100;
            placemark.highlightAttributes = highlightAttributes;

            // Add the placemark to the layer.
            placemarkLayer.addRenderable(placemark);

            placemarkLayer.enabled = true;

            // Add the placemarks layer to the World Window's layer list.
            globe.addLayer(placemarkLayer);

            // console.log(placemark.position.latitude);
            // console.log(placemark.position.longitude);
            CoordinateLatInfo.push(placemark.position.latitude);
            CoordinateLongInfo.push(placemark.position.longitude);
        };

        // Create a layer manager for controlling layer visibility.
        // var layerManager = new LayerManager(globe);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(globe);

        var sitePopUp = function(jsonobj) {
            var sitename, sitedesc, picpath, siteurl;
            var latlong = jsonobj.latitude + "," + jsonobj.longitude;
            var popupBodyItem = $("#modalBody");
            $(popupBodyItem).children().remove();

            // var popupBodyItem, popupBodyName, popupBodyDesc, popupBodyImg, popupBodyURL;
            // $.getJSON(popupjsonpath, function (res) {
            //     //Get site information.
            //     for (var n = 0; n < res.length; n++) {
            //         if (res[n].SiteID === siteid) {
            //             sitename = res[n].SiteName;
            //             picpath = res[n].PicPath;
            //             sitedesc = res[n].SiteDescription;
            //             siteurl = res[n].SiteURL;
            //             break;
            //         }
            //     }
            //
            // $.getJSON( "LayerNCC.json", function (jasn) {
            //             //     for (var n = 0; n < SelectedLayers.length; n++) {
            //             //         // if (n < SelectedLayers.length) {
            //             //         sitename = jasn[n].Site_Name;
            //             //         picpath = jasn[n].Picture_Location;
            //             //         sitedesc = jasn[n].Site_Description;
            //             //         siteurl = jasn[n].Link_to_site_Location;
            //             //         break;
            //             //         // }
            //             //     }
            //             // });
            // $.getJSON( "LayerNCC.json", function (jason) {  });
            // var lat = jsonobj.latitude;
            // var long = jsonobj.longitude;
            // console.log (loca);

            for (var z = 0; z < LayerInfo.length; z++) {

                if (listLoca[z] === latlong) {
                    sitename = LayerInfo[z].Site_Name;
                    picpath = "../images/Placemark_Images/" + LayerInfo[z].Picture_Location;
                    sitedesc = LayerInfo[z].Site_Description;
                    siteurl = LayerInfo[z].Link_to_site_Location;
                    break;
                }
            }

            //Insert site information into indexTest.html.
            var popupBodyName = $('<p class="site-name"><h4>' + sitename + '</h4></p>');
            var popupBodyDesc = $('<p class="site-description">' + sitedesc + '</p><br>');
            var popupBodyImg = $('<img class="site-img" src="' + picpath + '" width=100% height=auto /><br>');
            var popupBodyURL = $('<p class="site-URL">Please click <a href="' + siteurl + '" target="_blank"><span id="href"><b>here</b></span></a> for more detailed information</p>');

            popupBodyItem.append(popupBodyName);
            popupBodyItem.append(popupBodyDesc);
            popupBodyItem.append(popupBodyImg);
            popupBodyItem.append(popupBodyURL);
        };

        var handleMouseCLK = function (o) {

            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = o.clientX,
                y = o.clientY;

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.

            //This is the the Popup Box coordinate finder
            var pickList = globe.pick(globe.canvasCoordinates(x, y));
            // console.log(pickList.objects[0]);
            for (var q = 0; q < pickList.objects.length; q++) {
                var pickedPL = pickList.objects[q].userObject;
                // console.log (pickedPL);
                if (pickedPL instanceof WorldWind.Placemark) {
                    console.log (pickedPL.position.latitude);
                    sitePopUp(pickedPL.position);
                    //alert("It Worked");

                    $(document).ready(function () {
                        // console.log("It's connected");
                        // Get the modal
                        var modal = document.getElementById('myModal');

                        // Get the button that opens the modal
                        // var btn = document.getElementById("myBtn");
                        //
                        // Get the <span> element that closes the modal
                        var span = document.getElementsByClassName("close")[0];

                        // When the user clicks the button, open the modal

                        modal.style.display = "block";

                        // When the user clicks on <span> (x), close the modal
                        span.onclick = function() {
                            modal.style.display = "none";
                        };

                        // When the user clicks anywhere outside of the modal, close it
                        window.onclick = function(event) {
                            if (event.target == modal) {
                                modal.style.display = "none";
                            }
                        };
                    })
                }
            }
        };

        // Listen for mouse double clicks placemarks and then pop up a new dialog box.
        globe.addEventListener("click", handleMouseCLK);

        // Listen for taps on mobile devices and then pop up a new dialog box.
        var tapRecognizer = new WorldWind.TapRecognizer(globe, handleMouseCLK);

    });
