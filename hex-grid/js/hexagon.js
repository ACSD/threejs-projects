import {
    Color,
    ExtrudeBufferGeometry,
    Shape,
    Mesh,
    MeshPhongMaterial,
    Vector2
} from '../../_/js/module/three.module.js';

let SYMBOLS = {
    CENTER: Symbol("center"),
    RADIUS: Symbol("radius"),
    TOPPED: Symbol("type")
};

class HexagonShape extends Shape {
    static TOPPED = {
        FLAT: Symbol("FLAT"),
        POINTY: Symbol("POINTY")
    }

    constructor(center, radius, topped = HexagonShape.TOPPED.FLAT) {
        super();

        this.center = center;
        this.radius = radius;
        this.topped = topped;

        this.__fix__curves();
    }

    getCorner(i) {
        var angle_off = (this.type == HexagonShape.TOPPED.FLAT ? 30 : 0);
        var angle_deg = 60 * i - angle_off;
        var angle_rad = Math.PI / 180 * angle_deg

        return new Vector2(
            this.center.x + this.radius * Math.cos(angle_rad),
            this.center.y + this.radius * Math.sin(angle_rad));
    }

    set center(value) {
        if (!(value instanceof Vector2 || value.constructor == Vector2))
            throw TypeError("invalid type for parameter 'center' expected THREE.Vector2")

        this[SYMBOLS.CENTER] = value;

        this.__fix__curves();
    }

    get center() {
        return this[SYMBOLS.CENTER];
    }

    set radius(value) {
        if (!("number" == typeof value))
            throw TypeError(
                "invalid type for parameter 'radius', expected a number");

        this[SYMBOLS.RADIUS] = value;

        this.__fix__curves();
    }

    get radius() {
        return this[SYMBOLS.RADIUS];
    }

    set topped(value) {
        if (!(value == HexagonShape.TOPPED.FLAT ||
                value == HexagonShape.TOPPED.POINTY))
            throw TypeError("invalid type for parameter 'type' expected a value from HexagonShape.TYPE");

        this[SYMBOLS.TOPPED] = value;

        this.__fix__curves();
    }

    get topped() {
        return this[SYMBOLS.TOPPED];
    }



    __fix__curves() {
        if ("undefined" != typeof this.topped) {
            this.curves = [];
            for (var i = 0; i < 6; i++) {
                let p = this.getCorner(i + 1);
                i == 0 ? this.moveTo(p.x, p.y) : this.lineTo(p.x, p.y);
            }
        }
    }
}

class HexagonCell extends Mesh {
    constructor(p, r, size, height) {
        super(
            new ExtrudeBufferGeometry(
                new HexagonShape(new Vector2(0, 0), size), {
                    depth: height,
                    bevelEnabled: true,
                    bevelSegments: 2,
                    steps: 2,
                    bevelSize: 1,
                    bevelThickness: 1
                }),
            new MeshPhongMaterial({
                color: 0x696969,
                specular: 0x000000,
                shininess: 10,
                flatShading: true
            }));

        this.position.set(p.x, p.y, p.z);
        this.rotation.set(r.x, r.y, r.z);
        this.scale.set(1, 1, 1);
    }

    set height(value) {

        this.scale.z = value;
    }
    get height() {

        return this.scale.z;
    }

    set color(value) {
        this.material.color = new Color(value);
    }
    get color() {
        return this.material.color;
    }

    set specular(value) {
        this.material.specular = new Color(value);
    }
    get specular() {
        return this.material.specular;
    }

}

window["Vector2"] = Vector2;
window["HexagonCell"] = HexagonCell;

export {
    HexagonShape,
    HexagonCell
};
export default HexagonShape;