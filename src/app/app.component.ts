import { Component, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
//@ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//@ts-ignore 引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js';
// @ts-ignore 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
// @ts-ignore 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

//@ts-ignore
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('demo', { static: true }) demo: any;
  title = 'three';
  scene: any;
  camera: any;
  renderer: any;
  stats: any;
  cube: any;
  // 光照配置
  pointLight: any;
  ambient = {
    intensity: 2,
  };
  animationClipList: any;
  mixer: any;
  mixer2: any;
  mixer3: any;
  // 创建一个时钟对象Clock
  clock = new THREE.Clock();
  clock2 = new THREE.Clock();
  clock3 = new THREE.Clock();
  ngOnInit(): void {
    this.initCanvas();
  }
  initCanvas() {
    this.createSence();
    this.SphereGeometry();
    this.CylinderGeometry();
    this.PlaneGeometry();
    this.CircleGeometry();
    this.createCamera();

    this.createRenderer();
    this.boxGeometry();
    this.PointsMaterial();
    this.LineBasicMaterial();
    this.MeshBasicMaterial();
    this.createStats();
    this.OrbitControls();
    this.PointLight();
    this.AxesHelper();
    this.animation();
    this.createGridHelper();
    this.resize();
    this.createGUI();
    this.createGLTFLoader();
    this.createOBJLoader();
    this.createRain();
  }
  // 场景
  createSence() {
    // 场景
    const scene = (this.scene = new THREE.Scene());
  }
  // 几何体
  createGeometry() {
    //创建一个长方体几何对象Geometry
    const geometry = new THREE.BoxGeometry(100, 100, 100);
  }
  // 几何体 + 材质 = 物体
  createMesh(geometry: any, material: any) {
    const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
  }
  // 创建相机
  createCamera() {
    // 实例化一个透视投影相机对象
    const camera = (this.camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    ));
    camera.position.set(2, 2, 200);
    const helper = new THREE.CameraHelper(camera);
    this.scene.add(helper);
  }
  // 创建渲染器处理 场景+相机，输出画面
  createRenderer() {
    // 创建渲染器对象
    const renderer = (this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    }));
    // 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
    renderer.setPixelRatio(window.devicePixelRatio);

    //背景色
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(this.scene, this.camera); //执行渲染操作
    //canvas 贴到html
    this.demo.nativeElement.append(renderer.domElement);
  }
  // 长方体
  boxGeometry() {
    const geometry = new THREE.BoxGeometry(8, 8, 8, 1, 1, 1);

    //纹理贴图加载器TextureLoader
    const texLoader = new THREE.TextureLoader();
    const texture = texLoader.load('/assets/jhk-1697441951590.jpg');
    const material = new THREE.MeshBasicMaterial({
      map: texture, //map表示材质的颜色贴图属性
    });
    const cube = (this.cube = new THREE.Mesh(geometry, material));
    cube.position.set(0, 0, 0);
    this.scene.add(cube);
  }
  // 球体
  SphereGeometry() {
    const geometry = new THREE.SphereGeometry(5);
    //纹理贴图加载器TextureLoader
    const texLoader = new THREE.TextureLoader();
    const texture = texLoader.load('/assets/gray_rocks_disp_4k.png');
    const material = new THREE.MeshLambertMaterial({
      map: texture,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(10, 10, 10);
    this.scene.add(cube);
  }
  // 圆柱
  CylinderGeometry() {
    // CylinderGeometry：圆柱
    const geometry = new THREE.CylinderGeometry(2, 2, 30);
    //纹理贴图加载器TextureLoader
    const texLoader = new THREE.TextureLoader();
    const texture = texLoader.load('/assets/树.jpg');

    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(-10, -10, -10);
    this.scene.add(cube);
  }
  // 正面
  PlaneGeometry() {
    // PlaneGeometry：矩形平面
    const geometry = new THREE.PlaneGeometry(10, 5);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      side: THREE.DoubleSide, //两面可见
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(-10, 10, -10);
    this.scene.add(cube);
  }
  // 圆面
  CircleGeometry() {
    // CircleGeometry：圆形平面
    const geometry = new THREE.CircleGeometry(5);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      side: THREE.DoubleSide, //两面可见
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(10, -10, -10);
    this.scene.add(cube);
  }
  // 相机轨道
  OrbitControls() {
    // 设置相机控件轨道控制器OrbitControls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    controls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera); //执行渲染操作
    }); //监听鼠标、键盘事件
  }
  // 点模型【用点绘制的图形】
  PointsMaterial() {
    // 点渲染模式
    const material = new THREE.PointsMaterial({
      color: 0xffff00,
      size: 1.0, //点对象像素尺寸
    });
    const geometry = new THREE.SphereGeometry(5);
    const points = new THREE.Points(geometry, material); //点模型对象
    points.position.set(-20, 20, 20);
    this.scene.add(points);
  }
  // 线材质对象
  LineBasicMaterial() {
    const material = new THREE.LineBasicMaterial({
      color: 0xff0000, //线条颜色
      linewidth: 0.1,
    });
    const geometry = new THREE.SphereGeometry(5);
    // 创建线模型对象
    const line = new THREE.Line(geometry, material);
    line.position.set(-20, -20, 20);

    this.scene.add(line);
  }
  // 网络模型
  MeshBasicMaterial() {
    const material = new THREE.MeshBasicMaterial({
      color: 0x0000ff, //材质颜色
      side: THREE.FrontSide, //默认只有正面可见
    });
    const geometry = new THREE.SphereGeometry(5, 20);
    // 创建线模型对象
    const line = new THREE.LineLoop(geometry, material);
    line.position.set(-20, -20, -20);
    this.scene.add(line);
  }
  // 点光源
  PointLight() {
    const pointLight = (this.pointLight = new THREE.PointLight(
      0xffffff,
      20.0,
      0,
      0
    ));
    pointLight.position.set(50, 20, 0); //点光源放在x轴上
    this.scene.add(pointLight); //点光源添加到场景中
    this.PointLightHelper(pointLight);
  }
  // AxesHelper：辅助观察的坐标系
  AxesHelper() {
    const axesHelper = new THREE.AxesHelper(150);
    this.scene.add(axesHelper);
  }
  // 光源辅助观察
  PointLightHelper(pointLight: any) {
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
    this.scene.add(pointLightHelper);
  }
  animation() {
    this.renderer.render(this.scene, this.camera); //执行渲染操作
    this.cube.rotateY(0.01); //每次绕y轴旋转0.01弧度
    this.stats.update();
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }
    if (this.mixer2) {
      this.mixer2.update(this.clock2.getDelta());
    }

    let ani = () => this.animation();
    requestAnimationFrame(ani); //请求再次执行渲染函数render，渲染下一帧
  }
  resize() {
    window.onresize = () => {
      // 重置渲染器输出画布canvas尺寸
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
      this.camera.aspect = window.innerWidth / window.innerHeight;
      // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
      // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
      // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
      this.camera.updateProjectionMatrix();
    };
  }
  //性能监视器
  createStats() {
    //创建stats对象
    const stats = (this.stats = new Stats());
    //stats.domElement:web页面上输出计算结果,一个div元素，
    document.body.appendChild(stats.domElement);
  }
  createGUI() {
    // 实例化一个gui对象
    const gui = new GUI();

    // gui增加交互界面，用来改变obj对应属性
    gui.add(this.pointLight, 'intensity', 0, 2.0);
  }
  createGridHelper() {
    const size = 100;
    const divisions = 20;

    const gridHelper = new THREE.GridHelper(size, divisions);
    this.scene.add(gridHelper);
  }
  createGLTFLoader() {
    // 创建GLTF加载器对象
    const loader = new GLTFLoader();
    loader.load('../assets/glb/Bee.glb', (gltf: any) => {
      console.log('🐝', gltf);
      console.log('gltf对象场景属性', gltf.scene);
      gltf.scene.position.set(0, 3, 0);
      // 返回的场景对象gltf.scene插入到threejs场景中
      this.mixer2 = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((animation: any) => {
        let action = this.mixer2.clipAction(animation);
        action.play();
      });

      this.scene.add(gltf.scene);
    });
    const loader2 = new GLTFLoader();
    loader2.load('../assets/glb/niu.glb', (gltf: any) => {
      console.log('🐂', gltf);
      console.log('gltf对象场景属性', gltf.scene);
      this.mixer = new THREE.AnimationMixer(gltf.scene);
      //  获取gltf.animations[0]的第一个clip动画对象
      const clipAction = this.mixer.clipAction(gltf.animations[0]); //创建动画clipAction对象
      clipAction.play(); //播放动画

      gltf.scene.position.set(-40, 0, 0);
      // 返回的场景对象gltf.scene插入到threejs场景中
      gltf.scene.scale.set(10, 10, 10);

      this.scene.add(gltf.scene);
    });
    const loader3 = new GLTFLoader();
    loader3.load('../assets/glb/tree.glb', (gltf: any) => {
      console.log('🌳', gltf);
      console.log('gltf对象场景属性', gltf.scene);

      gltf.scene.position.set(40, 0, -40);
      // 返回的场景对象gltf.scene插入到threejs场景中
      gltf.scene.scale.set(50, 50, 50);

      this.scene.add(gltf.scene);
    });
  }
  createOBJLoader() {
    // 创建GLTF加载器对象
    const loader = new OBJLoader();
    loader.load('../assets/obj/Eagle_custom_Normals.obj', (obj: any) => {
      console.log('🦅', obj);

      // 返回的场景对象gltf.scene插入到threejs场景中
      obj.position.set(30, 0, 0);
      obj.scale.set(0.04, 0.04, 0.04);
      this.scene.add(obj);
    });
  }
  createRain() {
    const texture = new THREE.TextureLoader().load('/assets/雨滴.png');
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
    });
    const group = new THREE.Group();
    for (let i = 0; i < 50; i++) {
      // 精灵模型共享材质
      const sprite = new THREE.Sprite(spriteMaterial);
      group.add(sprite);
      // sprite.scale.set(1, 1, 1);
      // 设置精灵模型位置，在长方体空间上上随机分布
      const x = 100 * (Math.random() - 0.5);
      const y = 100 * (Math.random() - 0.5);
      const z = 100 * (Math.random() - 0.5);
      sprite.position.set(x, y, z);
    }
    this.scene.add(group);
    function loop() {
      // loop()每次执行都会更新雨滴的位置，进而产生动画效果
      group.children.forEach((sprite) => {
        // 雨滴的y坐标每次减1
        sprite.position.y -= 0.5;
        if (sprite.position.y < 0) {
          // 如果雨滴落到地面，重置y，从新下落
          sprite.position.y = 60;
        }
      });
      requestAnimationFrame(loop);
    }
    loop();
  }
  createTree() {}
}
