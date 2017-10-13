import { Component, OnInit } from '@angular/core';
import THREE from './three.js';
import * as Detector from 'three/examples/js/Detector.js';
import * as dat from 'three/examples/js/libs/dat.gui.min.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


    ngOnInit() {

        if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
        let container;
        let camera, scene, renderer, controls;
        let light, pointLight;
        let material1, material2, material3;
        let analyser1, analyser2, analyser3;
        let clock = new THREE.Clock();

        init();

        animate();
        function init() {
            container = document.getElementById( 'container' );
            camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
            camera.position.set( 0, 25, 0 );
            let listener = new THREE.AudioListener();
            camera.add( listener );
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2( 0x000000, 0.0025 );
            light = new THREE.DirectionalLight( 0xffffff );
            light.position.set( 0, 0.5, 1 ).normalize();
            scene.add( light );
            let sphere = new THREE.SphereGeometry( 20, 32, 16 );
            material1 = new THREE.MeshPhongMaterial( { color: 0xffaa00, flatShading: true, shininess: 0 } );

            // sound spheres
            let audioLoader = new THREE.AudioLoader();
            let mesh1 = new THREE.Mesh( sphere, material1 );

            mesh1.position.set( -250, 30, 0 );
            scene.add( mesh1 );
            let sound1 = new THREE.PositionalAudio( listener );
            audioLoader.load( '../assets/sounds/josh_pan-i_used_to.mp3', function( buffer ) {
                sound1.setBuffer( buffer );
                sound1.setRefDistance( 20 );
                sound1.play();
            });
            mesh1.add( sound1 );

            let oscillator = listener.context.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = 144;
            oscillator.start(0);

            // analysers
            analyser1 = new THREE.AudioAnalyser( sound1, 32 );
            // ground
            let helper = new THREE.GridHelper( 1000, 10, 0x444444, 0x444444 );
            helper.position.y = 0.1;
            scene.add( helper );
            //
            let SoundControls = function() {
                this.master = listener.getMasterVolume();
                this.firstSphere =  sound1.getVolume();
            };
            let GeneratorControls = function() {
                this.frequency = oscillator.frequency.value;
                this.wavetype = oscillator.type;
            };
            let gui = new dat.GUI();
            let soundControls = new SoundControls();
            let generatorControls = new GeneratorControls();
            let volumeFolder = gui.addFolder('sound volume');
            let generatorFolder = gui.addFolder('sound generator');

            volumeFolder.add(soundControls, 'master').min(0.0).max(1.0).step(0.01).onChange(function() {
                listener.setMasterVolume(soundControls.master);
            });
            volumeFolder.add(soundControls, 'firstSphere').min(0.0).max(1.0).step(0.01).onChange(function() {
                sound1.setVolume(soundControls.firstSphere);
            });
            volumeFolder.open();

            generatorFolder.add(generatorControls, 'frequency').min(50.0).max(5000.0).step(1.0).onChange(function() {
                oscillator.frequency.value = generatorControls.frequency;
            });
            generatorFolder.add(generatorControls, 'wavetype', ['sine', 'square', 'sawtooth', 'triangle']).onChange(function() {
                oscillator.type = generatorControls.wavetype;
            });
            generatorFolder.open();
            renderer = new THREE.WebGLRenderer( { antialias: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            container.innerHTML = "";
            container.appendChild( renderer.domElement );
            //
            controls = new THREE.FirstPersonControls( camera, renderer.domElement );
            controls.movementSpeed = 70;
            controls.lookSpeed = 0.05;
            controls.noFly = true;
            controls.lookVertical = false;

            window.addEventListener( 'resize', onWindowResize, false );

        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
            controls.handleResize();

        }

        function render() {
            let delta = clock.getDelta();
            controls.update( delta );
            material1.emissive.b = analyser1.getAverageFrequency() / 256;
            //material2.emissive.b = analyser2.getAverageFrequency() / 256;
            //material3.emissive.b = analyser3.getAverageFrequency() / 256;
            renderer.render( scene, camera );
        }



        function animate () {
            requestAnimationFrame( animate );
            render();
        };


    }

}
