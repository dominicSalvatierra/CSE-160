// Turns both axes and grid visible on/off
	// GUI requires a property that returns a bool
	import * as THREE from 'three';
    
    // to decide to make a checkbox so we make a setter
	// can getter for `visible` which we can tell GUI
	// to look at.
	export default class AxisGridHelper {

		constructor( node, units = 10 ) {

			const axes = new THREE.AxesHelper();
			axes.material.depthTest = false;
			axes.renderOrder = 2; // after the grid
			node.add( axes );

			const grid = new THREE.GridHelper( units, units );
			grid.material.depthTest = true;
			grid.renderOrder = 1;
			node.add( grid );

			this.grid = grid;
			this.axes = axes;
			this.visible = false;

		}
		get visible() {

			return this._visible;

		}
		set visible( v ) {

			this._visible = v;
			this.grid.visible = v;
			this.axes.visible = v;

		}

	}