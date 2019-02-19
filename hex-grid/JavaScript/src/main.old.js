var container, stats, info, camera, scene, renderer, group, hg, sel;
var gui, mat = { color: 0x696969, specular: 0x000000, shininess: 30, flatShading: true };

var config = { size:31, step: 2 ** -8, select_count: 8 };
var app = { grid: new THREE.HexGrid() };

var target_heights = new Map();

var select_count=8;

init();window.addEventListener("load",function(){animate(); generate_grid(); create_gui();});

function init() {
    container = document.getElementById( 'container' );
    info = document.getElementById( 'info' );

    scene=new THREE.Scene();scene.background=new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set(0,0,500);scene.add(camera);

    var light=new THREE.PointLight(0xffffff,1);camera.add(light);
    camera.add(new THREE.AmbientLight( 0x111111 ));

    group=new THREE.Group();group.position.y=window.innerHeight/16;scene.add(group);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    // window.addEventListener( 'mousedown', generate_grid, false );
    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    generate_grid();
}
function hc(c,s,i){var d=60*i;var a=Math.PI/180*d;return {x:(c.x+s*Math.cos(a)),y:(c.y+s*Math.sin(a))};}

function generate_grid(){
    scene.background=new THREE.Color(mat.color);
    var p;hg=new THREE.Shape();for(var i=0;i<6;i++){p=hc({x:0,y:0},config.size,i+1);i==0?hg.moveTo(p.x,p.y):hg.lineTo(p.x,p.y);}

    while(group.children.length>0){group.remove(group.children[0]);}
    var e={depth:100,bevelEnabled:true,bevelSegments:2,steps:2,bevelSize:1,bevelThickness:1};

    var w=(2*config.size)*0.76,h=Math.sqrt(Math.PI)*config.size;
    var c=(((window.innerWidth*1.1)/(w*4))<<0)+(15-(config.size / 10)),
        r=(((window.innerHeight*1.1)/(h*4))<<0)+(14-(config.size / 10));
    var a=((c*w)/2),b=((r*h)/1.8);

    for(var x=0;x<c;x++){for(var y=0;y<r;y++){as(hg,e,0x111111,(x*w)-a,((y*h)-(x%2?h/2:0))-b,0,0,0,0,1);}}
    //group.traverse(function(e){e.scale.set(1,1,Math.abs(Math.random()));});

    if(app.gui)app.gui.sel_.max(group.children.length);
    group.position.x = 0.5*config.size;
    group.position.y = (Math.sqrt(Math.PI/2)*config.size);
}

function animate(){requestAnimationFrame(animate);render();}
function render(){group.traverse(ht);sc();renderer.render(scene,camera);}

function as( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
    // extruded shape
    var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
    var material = new THREE.MeshPhongMaterial(mat);

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x,y,z);mesh.rotation.set(rx,ry,rz);mesh.scale.set(s,s,s);group.add(mesh);
}

function sc() {
    if(!group.children)return;var items=group.children,probability=0.1;
    for(var i=0; i < config.select_count; i++) {
        var item = items[Math.floor(Math.random()*items.length)];if(!item)return;
        if(Math.random()>(1-probability) && !target_heights.has(item.uuid))
            target_heights.set(item.uuid,Math.abs(Math.random()));
    }
}

function ht(child) {
    if(target_heights.has(child.uuid)) {
        var c = child.scale.z;
        var t=target_heights.get(child.uuid);
        var d=t-c;var m=(d%config.step);
        if(c==t-m)target_heights.delete(child.uuid);
        else c-=d>0?-config.step:config.step;child.scale.set(1,1,c);
    }
}

function create_gui() {
    if(app.gui) app.gui.remove();
    app.gui = new dat.GUI( { name: "Hex Grid", width: 350, hideable: true } );

    app.gui.color = app.gui.addColor(mat, "color").onChange(generate_grid);

    app.gui.size = app.gui.add(config, "size", 20, 100, 1).onChange(generate_grid);
    app.gui.step = app.gui.add(config, "step", 0, 0.05, 2**-8);
    app.gui.sel_ = app.gui.add(config, "select_count", 1, 100, 1);

    // app.gui.add(app.grid,'generate').name("Generate");
}
