import { Component, OnInit, ViewChild } from '@angular/core';
import THREE from '../three.js';
import * as Detector from 'three/examples/js/Detector.js';
import * as dat from 'three/examples/js/libs/dat.gui.min.js';


@Component({
  selector: 'app-root',
  templateUrl: './sound.component.html',
  styleUrls: ['./sound.component.css']
})
export class SoundTestComponent implements OnInit {


    mesh = [];
    container: any;
    camera: any;
    scene: any;
    renderer: any;
    controls: any;
    light: any;
    material1: any;
    analyser1: any;
    clock = new THREE.Clock();


    ngOnInit(){
        if ( ! Detector.webgl ) {
            Detector.addGetWebGLMessage();
        }


        this.init();

        this.animate();

    }


    init() {
        const lengthOfAnalyzer = 32;
        this.container = document.getElementById( 'container' );
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set( 0, 25, 0 );
        const listener = new THREE.AudioListener();
        this.camera.add( listener );
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( 0x000000, 0.0025 );
        this.light = new THREE.DirectionalLight( 0xffffff );
        this.light.position.set( 0, 2, 5 ).normalize();
        this.scene.add( this.light );
        let sphere = new THREE.SphereBufferGeometry( 16, 32, 32, 6, 6.3, 0, 3.3 );
        this.material1 = new THREE.MeshPhongMaterial( {
            color: 0xffaa00,
            flatShading: true,
            shininess: 0,
            morphTargets: true
        } );

        // sound spheres
        const audioLoader = new THREE.AudioLoader();

        const sound1 = new THREE.PositionalAudio( listener );
        audioLoader.load( '../assets/sounds/josh_pan-i_used_to.mp3', function( buffer ) {
            sound1.setBuffer( buffer );
            sound1.setRefDistance( 20 );
            sound1.play();
        });

        for (let i = 0; i < lengthOfAnalyzer / 2; i++) {
            const mesh = new THREE.Mesh( sphere, this.material1 );
            this.mesh.push(mesh);
            this.mesh[i].position.set( 50 * i, 30, 0 );
            this.scene.add( this.mesh[i] );
            this.mesh[i].add( sound1 );
        }


        const oscillator = listener.context.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 144;
        oscillator.start(0);

        // analysers
        this.analyser1 = new THREE.AudioAnalyser( sound1, lengthOfAnalyzer );
        // ground
        const helper = new THREE.GridHelper( 1000, 10, 0x444444, 0x444444 );
        helper.position.y = 0.1;
        this.scene.add( helper );
        //
        const SoundControls = function() {
            this.master = listener.getMasterVolume();
            this.firstSphere =  sound1.getVolume();
        };
        const GeneratorControls = function() {
            this.frequency = oscillator.frequency.value;
            this.wavetype = oscillator.type;
        };
        const gui = new dat.GUI();
        const soundControls = new SoundControls();
        const generatorControls = new GeneratorControls();
        const volumeFolder = gui.addFolder('sound volume');
        const generatorFolder = gui.addFolder('sound generator');

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
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.innerHTML = '';
        this.container.appendChild( this.renderer.domElement );
        //
        this.controls = new THREE.FirstPersonControls( this.camera, this.renderer.domElement );
        this.controls.movementSpeed = 70;
        this.controls.lookSpeed = 0.05;
        this.controls.noFly = true;
        this.controls.lookVertical = false;

        window.addEventListener( 'resize', this.onWindowResize, false );

    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.controls.handleResize();

    }

    render() {
        const delta = this.clock.getDelta();
        this.controls.update( delta );
        this.material1.emissive.b = this.analyser1.getAverageFrequency() / 256;
        // this.mesh1.
        // console.log('this is what we are getting' + this.mesh1);
        for (let i = 0; i < this.mesh.length; i++) {
            this.mesh[i].scale.set((this.analyser1.getFrequencyData()[i]/75), (this.analyser1.getFrequencyData()[i]/75), (this.analyser1.getFrequencyData()[i]/75) );
        }
        this.renderer.render( this.scene, this.camera );
    }



    animate = () => {
        requestAnimationFrame( this.animate );
        this.render();
    }



}
