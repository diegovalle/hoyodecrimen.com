import * as React from "react";
import { useState, cloneElement } from "react";
import { useControl } from "react-map-gl";
import { createPortal } from "react-dom";

import type { MapboxMap, IControl } from "react-map-gl";

// Based on template in https://docs.mapbox.com/mapbox-gl-js/api/markers/#icontrol
class OverlayControl implements IControl {
  _map: MapboxMap = null;
  _container: HTMLElement;
  _redraw: () => void;

  constructor(redraw: () => void) {
    this._redraw = redraw;
    this.name = "LoadingOverlay"
  }

  onAdd(map) {
    this._map = map;
    this.toggleLoading = () =>
      this._container.className === "maplibregl-ctrl maplibregl-ctrl-group"
        ? (this._container.className =
            "maplibregl-ctrl maplibregl-ctrl-group animation")
        : (this._container.className = "maplibregl-ctrl maplibregl-ctrl-group");
    this.turnOff = () =>
      this._container.className = "maplibregl-ctrl maplibregl-ctrl-group"
    this.turnOn = () =>
      this._container.className = "maplibregl-ctrl maplibregl-ctrl-group animation"
    map.on("move", this._redraw);
    /* global document */

    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    this._container.innerHTML =
      '<div class="loading-box">' +
      '<button aria-label="Loading">' +
      '<span class="mapboxgl-ctrl-icon my-image-button"  title="Description"></span>' +
      "</button>" +
      "</div>";
    this._redraw();
    return this._container;
  }

  onRemove() {
    this._container.remove();
    this._map.off("move", this._redraw);
    this._map = null;
  }

  getMap() {
    return this._map;
  }

  getElement() {
    return this._container;
  }

  toggleLoading(): boolean {
    this._container.className = "maplibregl-ctrl maplibregl-ctrl-group";
  }
}

/**
 * A custom control that rerenders arbitrary React content whenever the camera changes
 */
function LoadingOverlay(props: { children: React.ReactElement }) {
  const [, setVersion] = useState(0);

  const ctrl = useControl<OverlayControl>(() => {
    const forceUpdate = () => setVersion((v) => v + 1);
    return new OverlayControl(forceUpdate);
  });

  const map = ctrl.getMap();
  //ctrl.getClass(props.className)

  return null; //ctrl && createPortal(cloneElement(props.children, {map}), ctrl.getElement());
}

export default React.memo(LoadingOverlay);
