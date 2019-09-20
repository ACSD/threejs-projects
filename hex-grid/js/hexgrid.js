import {
    OrbitControls
} from '/_/js/controls/OrbitControls.js';
import * as THREE from '/_/js/module/three.module.js';
import Stats from '/_/js/module/stats.module.js';
import {
    GUI
} from '/_/js/module/dat.gui.module.js';

import THREEApp from '/_/js/module/THREEApp.js';

import {
    HexagonShape,
    HexagonCell
} from './hexagon.js';


var stats;

var gui, mat = {
    color: 0x696969,
    specular: 0x000000,
    shininess: 10,
    flatShading: true
};
var config = {
    depth: 110,
    size: 30,
    step: 260,
    attempts: 10,
    probability: 5
};

var target_heights = new Map();


class HexGrid extends THREEApp {
    constructor() {
        super({
            lights: [
                new THREE.PointLight(0xffffff, 1, 1000),
                new THREE.AmbientLight(0x111111)
            ],
            //camera: new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, -window.innerHeight/2, window.innerHeight/2, 1, 10000),
            container: document.getElementById("container"),
            canvas: document.getElementById("display")
        });
        this.init();
        this.generate_grid();
        this.animate();
    }

    init() {
        super.init();

        let light = this.lights[0];
        light.intensity = 3;



        this.camera.position.set(0, 0, 500);

        stats = new Stats();
        this.container.appendChild(stats.dom);

        this.group = new THREE.Group();
        this.scene.add(this.group);

        /*
        // controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 100;
        this.controls.maxDistance = 500;
        */

        this.create_gui();
    }

    animate = () => {
        super.animate();
        stats.update();
    }

    render = () => {

        this.group.traverse(this.ht);
        this.sc();

        super.render();
    }

    resize = () => {
        super.resize();

        this.generate_grid();
    }


    hc(c, s, i) {
        var d = 60 * i;
        var a = Math.PI / 180 * d;
        return {
            x: (c.x + s * Math.cos(a)),
            y: (c.y + s * Math.sin(a))
        };
    }

    generate_grid = () => {
        this.scene.background = new THREE.Color(mat.color);

        let hg = new HexagonShape(
            new THREE.Vector2(0, 0),
            config.size,
            HexagonShape.TOPPED.FLAT);

        while (this.group.children.length > 0) {
            this.group.children.pop();
        }


        var w = (2 * config.size) * 0.76,
            h = Math.sqrt(Math.PI) * config.size;
        var c = (((window.innerWidth * 1.1) / (w * 4)) << 0) + (15 - (config.size / 10)),
            r = (((window.innerHeight * 1.1) / (h * 4)) << 0) + (14 - (config.size / 10));
        var a = ((c * w) / 2),
            b = ((r * h) / 1.8);

        for (var x = 0; x < c; x++) {
            for (var y = 0; y < r; y++) {
                let cell = new HexagonCell(
                    new THREE.Vector3(
                        (x * w) - a,
                        ((y * h) - (x % 2 ? h / 2 : 0)) - b,
                        0),
                    new THREE.Vector3(0, 0, 0),
                    config.size, config.depth);

                this.group.add(cell);
            }
        }
        for (let [k, v] of Object.entries(this.group.children)) {
            v.height = Math.abs(Math.random());
        }

        if (this.gui) this.gui.grid.attempts.max(group.children.length);
        this.group.position.x = 0.5 * config.size;
        this.group.position.y = (Math.sqrt(Math.PI / 2) * config.size);
    }

    sc = () => {
        if (!this.group.children) return;
        var items = this.group.children;
        for (var i = 0; i < config.attempts; i++) {
            var item = items[Math.floor(Math.random() * items.length)];
            if (!item) return;
            if (Math.random() > (1 - (config.probability / 100)) && !target_heights.has(item.uuid))
                target_heights.set(
                    item.uuid,
                    Math.abs(Math.random()));
        }
    }

    ht = (child) => {
        if (target_heights.has(child.uuid)) {
            var target = target_heights.get(child.uuid);
            var height = child.height;

            // console.log(height);
            var q = ((height - target) / config.step);
            
            if (Math.abs(height - target) < 2 ** -12)
                target_heights.delete(child.uuid);
            else child.height -= q;
        }
    }

    create_gui = () => {
        if (gui) gui.remove();
        gui = new GUI({
            name: "Hex Grid",
            width: 350,
            hideable: true
        });

        var params = {
            'light color': this.lights[0].color.getHex(),
            intensity: this.lights[0].intensity,
            decay: this.lights[0].decay
        };
        var lfolder = gui.addFolder("light");
        let foo = val => {
            this.lights[1].color = new THREE.Color(
                val.r / 255,
                val.g / 255,
                val.b / 255);
        }
        lfolder.addColor(this.lights[1], 'color').onChange(foo);

        lfolder.add(this.lights[0], 'intensity', 0, 3);

        lfolder.add(this.lights[0], 'decay', 1, 2)

        var gfolder = gui.grid = gui.addFolder("grid");

        gfolder.color = gfolder.addColor(mat, "color").onChange(this.generate_grid);

        gfolder.depth = gfolder.add(config, "depth", 20, 200, 1).onChange(this.generate_grid);
        gfolder.size = gfolder.add(config, "size", 20, 100, 1).onChange(this.generate_grid);
        gfolder.step = gfolder.add(config, "step", 10, 1000, 10);
        gfolder.attempts = gfolder.add(config, "attempts", 1, 100, 1);
        gfolder.probability = gfolder.add(config, "probability", 1, 100, 0.5);

        // app.gui.add(app.grid,'generate').name("Generate");
    }
}
window["__hg"] = new HexGrid();