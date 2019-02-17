var container, stats, info, camera, scene, renderer, group, hg;
var target_heights = new Map(), materials=[];

var size=39, step = 2 ** -8, select_count=8;

init();window.addEventListener("load",function(){animate(); generate_grid();});

function init() {
    container = document.getElementById( 'container' );
    info = document.getElementById( 'info' );

    scene=new THREE.Scene();scene.background=new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set(0,0,500);scene.add(camera);

    var light=new THREE.PointLight(0xffffff,1);camera.add(light);
    camera.add(new THREE.AmbientLight( 0x111111 ));

    // materials.push( new THREE.MeshLambertMaterial( { map: texture, transparent: true } ) );
    materials.push( new THREE.MeshLambertMaterial( { color: 0xFFFFFF } ) );
    materials.push( new THREE.MeshPhongMaterial( { color: 0x696969, specular: 0x000000, shininess: 30, flatShading: true } ) );
    materials.push( new THREE.MeshNormalMaterial() );
    materials.push( new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } ) );
    materials.push( new THREE.MeshLambertMaterial( { color: 0xdddddd } ) );
    // materials.push( new THREE.MeshPhongMaterial( { color: 0xdddddd, specular: 0x009900, shininess: 30, map: texture, transparent: true } ) );
    materials.push( new THREE.MeshNormalMaterial( { flatShading: true } ) );
    materials.push( new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ) );
    materials.push( new THREE.MeshDepthMaterial() );
    materials.push( new THREE.MeshLambertMaterial( { color: 0x666666, emissive: 0xff0000 } ) );
    materials.push( new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, emissive: 0xff0000, shininess: 10, opacity: 0.9, transparent: true } ) );
    // materials.push( new THREE.MeshBasicMaterial( { map: texture, transparent: true } ) );

    group=new THREE.Group();group.position.y=50;scene.add(group);

    var p;hg=new THREE.Shape();for(var i=0;i<6;i++){p=hc({x:0,y:0},size,i+1);i==0?hg.moveTo(p.x,p.y):hg.lineTo(p.x,p.y);}

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    window.addEventListener( 'mousedown', generate_grid, false );
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    generate_grid();
}
function rc(){return 0xFFFFFF;}
// function rc(){ return (Math.random()*0xFFFFFF)<<0; }
function hc(c,s,i){var d=60*i;var a=Math.PI/180*d;return {x:(c.x+s*Math.cos(a)),y:(c.y+s*Math.sin(a))};}

function generate_grid(){
    while(group.children.length>0){group.remove(group.children[0]);}
    var e={depth:size*4,bevelEnabled:true,bevelSegments:2,steps:2,bevelSize:1,bevelThickness:1};

    var w=(2*size)*0.76,h=Math.sqrt(Math.PI)*size;
    var c=((window.innerWidth/(w*2))<<0)+3,r=((window.innerHeight/(h*2))<<0)+5;
    var a=(((c-1)*w)/2),b=((r*h)/1.6);

    for(var x=0;x<c;x++){for(var y=0;y<r;y++){as(hg,e,rc(),(x*w)-a,((y*h)-(x%2?h/2:0))-b,0,0,0,0,1);}}
    //group.traverse(function(e){e.scale.set(1,1,Math.abs(Math.random()));});
}

function animate(){requestAnimationFrame(animate);render();}
function render(){group.traverse(ht);sc();renderer.render(scene,camera);}

function as( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
    // extruded shape
    var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
    var material = new THREE.MeshPhongMaterial({color:color,specular:0x666666,emissive:0x888888,shininess:-10});
    var mesh = new THREE.Mesh( geometry, materials[1] );
    mesh.position.set(x,y,z);mesh.rotation.set(rx,ry,rz);mesh.scale.set(s,s,s);group.add(mesh);
}

function sc() {
    if(!group.children)return;var items=group.children,probability=0.1;
    for(var i=0; i < select_count; i++) {
        var item = items[Math.floor(Math.random()*items.length)];if(!item)return;
        if(Math.random()>(1-probability) && !target_heights.has(item.uuid))
            target_heights.set(item.uuid,Math.abs(Math.random()));
    }
}

function ht(child) {
    if(target_heights.has(child.uuid)) {
        var c = child.scale.z;
        var t=target_heights.get(child.uuid);
        var d=t-c;var m=(d%step);
        if(c==t-m)target_heights.delete(child.uuid);
        else c-=d>0?-step:step;child.scale.set(1,1,c);
    }
}
