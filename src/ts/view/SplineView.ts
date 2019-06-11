'use strict';

import * as THREE from 'three';
import {
    CatmullRomCurve3,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from "three";
import {OrbitControls} from 'three-orbitcontrols-ts';

namespace SplineView {

    export class Spline {

        protected scene:Scene;
        protected camera:PerspectiveCamera;
        protected controls:OrbitControls;
        protected render:WebGLRenderer;
        //
        protected planeMaterial:MeshStandardMaterial;
        protected planeMesh:Mesh;
        protected spline:CatmullRomCurve3;
        protected box:Mesh;
        //
        protected axis = new THREE.Vector3();
        protected up = new THREE.Vector3(0, 1, 0);
        protected counter:number = 0;
        protected tangent = new THREE.Vector3();

        constructor() {
            console.log('Spline construct');
            this.init();
        }
        protected init():void {
            const tag = jQuery('<div id="mapViewer"></div>');
            $('#container').append(tag);
            $(window).on('resize',(evnet:any)=>{this.resize(event);});
            this.resize(null);

            this.setupThree();
        }

        protected setupThree():void {
            this.scene = new Scene();
            this.scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
            this.scene.fog = new THREE.Fog( this.scene.background.getHex(), 1, 5000 );

            this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);
            this.camera.position.set(0, 0, 250);

            let hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
            hemiLight.color.setHSL( 0.6, 1, 0.6 );
            hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
            hemiLight.position.set( 0, 50, 0 );
            this.scene.add( hemiLight );
            let hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
            this.scene.add( hemiLightHelper );

            let dirLight = new THREE.DirectionalLight(0xffffff, 1);
            dirLight.color.setHSL( 0.1, 1, 0.95 );
            dirLight.position.set( - 1, 1.75, 1 );
            dirLight.position.multiplyScalar( 30 );
            dirLight.castShadow = true;
            dirLight.shadow.mapSize.width = 2048;
            dirLight.shadow.mapSize.height = 2048;
            this.scene.add(dirLight);

            let d = 50;
            dirLight.shadow.camera.left = - d;
            dirLight.shadow.camera.right = d;
            dirLight.shadow.camera.top = d;
            dirLight.shadow.camera.bottom = - d;
            dirLight.shadow.camera.far = 3500;
            dirLight.shadow.bias = - 0.0001;
            let dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
            this.scene.add( dirLightHeper );

            let planeGeom = new THREE.PlaneBufferGeometry(10000,10000);
            //planeGeom.center();
            this.planeMaterial = new MeshStandardMaterial();
            //this.planeMaterial.envMap = this.textureCube;
            this.planeMaterial.roughness = 1;
            this.planeMaterial.metalness = 0.0;
            //this.planeMaterial.color = new THREE.Color(0xffffff);
            this.planeMaterial.color.setHSL( 0.095, 1, 0.75 );
            //this.planeMaterial.side = THREE.DoubleSide;
            this.planeMesh = new THREE.Mesh( planeGeom, this.planeMaterial );
            this.planeMesh.position.y = - 33;
            this.planeMesh.rotation.x = - Math.PI / 2;
            this.planeMesh.receiveShadow = true;
            this.planeMesh.castShadow = true;
            this.scene.add( this.planeMesh );

            //
            let numPoints = 50;
            this.spline = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 0, 200),
                new THREE.Vector3(150, 0,150),
                new THREE.Vector3(150, 0, 50),
                new THREE.Vector3(250, 0, 100),
                new THREE.Vector3(250, 0, 300)]);

            let material = new THREE.LineBasicMaterial({
                color: 0xff00f0,
            });

            let geometry = new THREE.Geometry();
            let splinePoints = this.spline.getPoints(numPoints);

            for (let i = 0; i < splinePoints.length; i++) {
                geometry.vertices.push(splinePoints[i]);
            }

            let line = new THREE.Line(geometry, material);
            this.scene.add(line);
            //
            geometry = new THREE.BoxGeometry(5, 40, 4);
            let mat:MeshBasicMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000
            });

            this.box = new THREE.Mesh(geometry, mat);
            this.scene.add(this.box);

            this.render = new THREE.WebGLRenderer();
            this.render.autoClear = false;
            this.render.setPixelRatio( window.devicePixelRatio );
            this.render.setSize( window.innerWidth, window.innerHeight );
            //this.render.gammaOutput = true;
            //this.render.toneMappingExposure = 5.0;
            this.render.shadowMap.enabled = true;

            this.controls = new OrbitControls(this.camera, this.render.domElement, window);
            this.controls.minDistance = 0;
            this.controls.maxDistance = 2500;

            jQuery('#mapViewer').append(this.render.domElement)
            this.animate();

            setInterval(()=>{this.moveBox()},100);
        }

        protected moveBox() {
            if (this.counter <= 1) {
                this.box.position.copy( this.spline.getPointAt(this.counter) );

                this.tangent = this.spline.getTangentAt(this.counter).normalize();

                this.axis.crossVectors(this.up, this.tangent).normalize();

                let radians = Math.acos(this.up.dot(this.tangent));

                this.box.quaternion.setFromAxisAngle(this.axis, radians);

                this.counter += 0.005
            } else {
                this.counter = 0;
            }
        }

        protected animate() {
            requestAnimationFrame( ()=>{this.animate();} );
            /*this.mesh.rotation.x += 0.001;
            this.mesh.rotation.y += 0.002;
            this.controls.update();*/
            this.render.render( this.scene, this.camera );
        }


        protected resize(event:any):void {
            const wid = $(window).innerWidth();
            const hig = $(window).innerHeight();
            const can = $('#mapViewer canvas');
            if(can.length > 0)
                can.attr({'width':wid+'px','height':hig+'px'});
        }
    }
}

export default SplineView;