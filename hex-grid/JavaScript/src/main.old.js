var gui, mat = { color: 0x696969, specular: 0x000000, shininess: 10, flatShading: true };
var config = { depth: 100, size:31, step: 2**-10, attempts: 8, probability: 1 };
var app = new THREE.App({
    lights: [
        new THREE.PointLight(0xffffff, 1, 1000 ),
        new THREE.AmbientLight( 0x111111 )
    ]
}), light;

var target_heights = new Map();

init();
window.addEventListener("load",function(){animate(); generate_grid(); create_gui();});
window.addEventListener("resize", onWindowResize);

function init() {
    light = app.lights[0];
    light.intensity=3;

    app.init();

    app.container = document.getElementById( 'container' );

    group=new THREE.Group();

    app.scene.add(group);
}

function onWindowResize() {
    app.resize();
    generate_grid();
}
function hc(c,s,i){var d=60*i;var a=Math.PI/180*d;return {x:(c.x+s*Math.cos(a)),y:(c.y+s*Math.sin(a))};}

function generate_grid(){
    app.scene.background=new THREE.Color(mat.color);
    var p;hg=new THREE.Shape();for(var i=0;i<6;i++){p=hc({x:0,y:0},config.size,i+1);i==0?hg.moveTo(p.x,p.y):hg.lineTo(p.x,p.y);}

    while(group.children.length>0){group.remove(group.children[0]);}
    var e={depth:config.depth,bevelEnabled:true,bevelSegments:2,steps:2,bevelSize:1,bevelThickness:1};

    var w=(2*config.size)*0.76,h=Math.sqrt(Math.PI)*config.size;
    var c=(((window.innerWidth*1.1)/(w*4))<<0)+(15-(config.size / 10)),
        r=(((window.innerHeight*1.1)/(h*4))<<0)+(14-(config.size / 10));
    var a=((c*w)/2),b=((r*h)/1.8);

    for(var x=0;x<c;x++){for(var y=0;y<r;y++){as(hg,e,0x111111,(x*w)-a,((y*h)-(x%2?h/2:0))-b,0,0,0,0,1);}}
    //group.traverse(function(e){e.scale.set(1,1,Math.abs(Math.random()));});

    if(gui)gui.grid.attempts.max(group.children.length);
    group.position.x = 0.5*config.size;
    group.position.y = (Math.sqrt(Math.PI/2)*config.size);
}

function animate(){requestAnimationFrame(animate);render();}
function render(){group.traverse(ht);sc();app.render();}

function as( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
    // extruded shape
    var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
    var material = new THREE.MeshPhongMaterial(mat);

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(x,y,z);mesh.rotation.set(rx,ry,rz);mesh.scale.set(s,s,s);group.add(mesh);
}

function sc() {
    if(!group.children)return;var items=group.children;
    for(var i=0; i < config.attempts; i++) {
        var item = items[Math.floor(Math.random()*items.length)];if(!item)return;
        if(Math.random()>(1-(config.probability/100)) && !target_heights.has(item.uuid))
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
    if(gui) gui.remove();
    gui = new dat.GUI( { name: "Hex Grid", width: 350, hideable: true } );

    var params = {
        'light color': light.color.getHex(),
        intensity: light.intensity,
        decay: light.decay
    };
    var lfolder = gui.addFolder("light");
    lfolder.addColor(params,'light color').onChange(function(val){light.color.setHex(val);});
    lfolder.add(params,'intensity',0,3).onChange(function(val){light.intensity=val;});
    lfolder.add(params,'decay',1,2).onChange(function(val){light.decay=val;});

    var gfolder = gui.grid = gui.addFolder("grid");

    gfolder.color = gfolder.addColor(mat, "color").onChange(generate_grid);

    gfolder.depth = gfolder.add(config, "depth", 20, 200, 1).onChange(generate_grid);
    gfolder.size = gfolder.add(config, "size", 20, 100, 1).onChange(generate_grid);
    gfolder.step = gfolder.add(config, "step", 2**-10, 0.05+(2**-10), 2**-10);
    gfolder.attempts = gfolder.add(config, "attempts", 1, 100, 1);
    gfolder.probability = gfolder.add(config, "probability", 1, 100, 0.5);

    // app.gui.add(app.grid,'generate').name("Generate");
}
