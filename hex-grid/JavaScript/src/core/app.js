(function(){
    function App(options={}) {
        this.container = options.container||document.createElement("div");
        this.scene = options.scene||new THREE.Scene();

        this.lights = (options.lights instanceof Array) ? options.lights : [];

        this.camera = options.camera||null;
        this.renderer= options.renderer||new THREE.WebGLRenderer( { antialias: true } );
    }

    App.prototype.init = function() {
        this.container = document.getElementById( 'container' );

        this.scene.background=new THREE.Color(0xf0f0f0);

        this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.set(0,0,500);
        this.scene.add(this.camera);

        for(var i=0;i<this.lights.length;i++){this.camera.add(this.lights[i]);}

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );
    };

    App.prototype.resize = function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    };

    App.prototype.render = function() {
        this.renderer.render(this.scene,this.camera);
    };

    App.prototype.constructor = App;

    THREE.App = App;
}());
