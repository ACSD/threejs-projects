(function(){
    var config = { color: 0x696969, depth: 100, size:31, step: 2**-10, attempts: 8, probability: 1 },
        gui= new dat.GUI( { name: "Hex Grid", width: 350, hideable: true } ),
        grid= new THREE.HexGrid(), app = new THREE.App();

    function init() {
        create_grid();
        create_gui();
        app.init();
    }

    function resize() {

        app.resize();
    }

    function create_gui() {
        gui.addColor(config, "color").onChange(grid.generate);
        gui.depth = gui.add(config, "depth", 20, 200, 1).onChange(grid.generate);
        gui.size = gui.add(config, "size", 20, 100, 1).onChange(grid.generate);
        gui.step = gui.add(config, "step", 2**-10, 0.05+(2**-10), 2**-10);
        gui.attempts = gui.add(config, "attempts", 1, 100, 1);
        gui.probability = gui.add(config, "probability", 1, 100, 0.5);
    }

    function create_grid() {

    }

    window.addEventListener("load", init);
    window.addEventListener( 'resize', resize, false );
}());
