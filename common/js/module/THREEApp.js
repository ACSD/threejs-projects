import * as THREE from './three.module.js';
class THREEApp 
{
    constructor(options) 
    {
        this.container = options.container||document.createElement("div");

        this.scene = options.scene || new THREE.Scene();

        this.lights = (options.lights instanceof Array) ? options.lights : [];

        this.camera = options.camera || new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.set( - 4, 0, 6 );

        this.renderer = options.renderer || new THREE.WebGLRenderer( { antialias: false });
    }

    init() 
    {
        this.scene.background = new THREE.Color(0xf0f0f0);

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.position.set(0,0,1);
        this.scene.add(this.camera);

        for(var i=0;i<this.lights.length;i++){this.camera.add(this.lights[i]);}

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );


        window.addEventListener("resize", (e)=>this.resize(e));
        document.addEventListener( 'mousemove', (e)=>this.mousemove(e), false );
    };

    animate() {
        var _animate = () => this.animate();
        requestAnimationFrame( _animate );
        this.render();
    }

    render() 
    {
        this.renderer.render(this.scene, this.camera);
    };

    resize() 
    {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    };

    mousemove(){}
}

export default THREEApp;