(function(){
    HexGrid = function() {
        THREE.Group.call(this);
        this.material_index = 0;
    };

    HexGrid.prototype = Object.create(THREE.Group.prototype);
    HexGrid.prototype.constructor = HexGrid;
    HexGrid.prototype.generate = function() {

    };

    THREE.HexGrid = HexGrid;
}());
