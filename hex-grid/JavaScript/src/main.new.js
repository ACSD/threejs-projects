(function(){
    var app = {
        container: null, camera: null, scene: null, renderer: null, gui: null, grid: null,
        config: {
            material: {
                index: 0, callback: THREE.MeshPhongMaterial,
                __:{Basic:0,Depth:1,Lambert:2,Normal:3,Phong:4,Physical:5,Standard:6,Toon:7,
                    Points:8,RawShader:9,Shader:10,Shadow:11,Sprite:12 },
                default: {
                    MeshBasicMaterial: {},
                    MeshDepthMaterial: {},
                    MeshLambertMaterial: {},
                    MeshNormalMaterial: {},
                    MeshPhongMaterial: {},
                    MeshPhysicalMaterial: {},
                    MeshStandardMaterial: {},
                    MeshToonMaterial: {},
                    PointsMaterial: {},
                    RawShaderMaterial: {},
                    ShaderMaterial: {},
                    ShadowMaterial: {},
                    SpriteMaterial: {}
                }
            }
        }
    };

    function init() {
        create_grid();
        create_scene();
        create_gui();

    }

    function resize() {
        app.camera.aspect = window.innerWidth / window.innerHeight;
        app.camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function create_scene() {
        app.container = document.getElementById( 'container' );
        app.scene=new THREE.Scene();
        app.scene.background=new THREE.Color(0xf0f0f0);

        app.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
        app.camera.position.set(0,0,500);
        app.scene.add(app.camera);

        var light=new THREE.PointLight(0xffffff,1);
        app.camera.add(light);
        app.camera.add(new THREE.AmbientLight( 0x111111 ));

        app.renderer = new THREE.WebGLRenderer( { antialias: true } );

        app.renderer.setPixelRatio( window.devicePixelRatio );
        app.renderer.setSize( window.innerWidth, window.innerHeight );
        app.container.appendChild( app.renderer.domElement );
    }

    function create_gui() {
        app.gui = new dat.GUI( { name: "Hex Grid", width: 350, hideable: true } );
        var froot = app.gui.folders = {}, croot = app.config;

        var mroot = froot.material = app.gui.addFolder("Grid Material");
        var key = Object.keys(croot.material.__)[croot.material.index];

        mroot.type = mroot.add(croot.material, "index", croot.material.__)
            .name("Grid Material Type")
            .onChange(generate_grid);
        mroot.color = mroot.addColor(mat, "color").onChange(generate_grid);

        app.gui.color = app.gui.add(config, "size", 10, 100, 1).onChange(generate_grid);

        // app.gui.add(app.grid,'generate').name("Generate");
    }

    function create_grid() {
        app.grid = new THREE.HexGrid();
    }

    window.addEventListener("load", init);
    window.addEventListener( 'resize', resize, false );
}())
