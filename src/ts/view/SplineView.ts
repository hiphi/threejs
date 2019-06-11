'use strict';

import * as THREE from 'three';
import {Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, WebGLRenderer} from "three";
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