<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.container {
  position: absolute;
  right: 0;
  top: 5rem;
  bottom: 0;
  left: 0;
}
</style>

<template>
  <div class="container" ref="container"></div>
</template>

<script lang="ts">
import * as THREE from "three";
import { Component, Prop, Vue } from "vue-property-decorator";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

@Component
export default class Three extends Vue {
  @Prop() private msg!: string;
  private Camera!: THREE.Camera;
  private Scene!: THREE.Scene;
  private Render!: THREE.Renderer;
  private Cube!: THREE.Mesh;
  private Light!: THREE.Light;
  private animateCount!: number;
  private Mouse!: THREE.Vector2;
  private Controller!: OrbitControls;
  private Raycaster!: THREE.Raycaster;
  private SelectedObj!: any;
  private Group!: THREE.Group;

  async mounted() {
    await this.init();
    this.simpleBoxInit();
    this.Mouse = new THREE.Vector2();
    window.addEventListener("resize", this.onWindowResize);
  }

  beforeDestroy() {
    cancelAnimationFrame(this.animateCount);
    window.removeEventListener("resize", this.onWindowResize);
  }

  init(): void {
    // 场景
    this.Scene = new THREE.Scene();
    this.Scene.background = new THREE.Color(0xcccccc);
    this.Scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

    // console.log("Scene----->", this.Scene.position);

    // 透视相机
    this.Camera = new THREE.PerspectiveCamera(
      75,
      (this.$refs.container as any).clientWidth /
        (this.$refs.container as any).clientHeight,
      0.5,
      1000
    );
    this.Camera.position.x = 1.5;
    this.Camera.position.y = 1.5;
    this.Camera.position.z = 5;

    // const helper = new THREE.GridHelper(2000, 100);
    // helper.position.y = -199;
    // (helper.material as THREE.Material).opacity = 0.25;
    // (helper.material as THREE.Material).transparent = true;
    // 坐标轴helper
    const axesHelper = new THREE.AxesHelper(3);
    this.Scene.add(axesHelper);

    // 渲染器
    this.Render = new THREE.WebGLRenderer({ antialias: true }); // 反锯齿

    // 轨道控制器 OrbitControls
    this.Controller = new OrbitControls(this.Camera, this.Render.domElement);
    this.Controller.enableRotate = true;
    // 阻尼
    this.Controller.enableDamping = true;
    // 阻尼因子
    this.Controller.dampingFactor = 0.05;
    this.Controller.autoRotate = true;
    // 屏幕空间平移
    this.Controller.screenSpacePanning = false;
    this.Controller.minDistance = 1;
    this.Controller.maxDistance = 5;
    // 最大极角
    this.Controller.maxPolarAngle = Math.PI / 2;
    this.Controller.update();

    // 灯光
    const directionLight = new THREE.DirectionalLight(0xffffff);
    directionLight.position.set(1, 1, 1);
    this.Scene.add(directionLight);

    const colorDirectionLight = new THREE.DirectionalLight(0x002288);
    colorDirectionLight.position.set(-1, -1, -1);
    this.Scene.add(colorDirectionLight);

    const ambientLight = new THREE.AmbientLight(0x222222);
    this.Scene.add(ambientLight);

    //光线投射器 光线投射主要用于物体选择、碰撞检测以及图像成像等方面
    this.Raycaster = new THREE.Raycaster();
  }

  simpleBoxInit(): void {
    // 创建box几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // 创建材料
    const material = new THREE.MeshNormalMaterial();

    // 分组,和Object3D是相同
    this.Group = new THREE.Group();
    this.Scene.add(this.Group);

    //add sprites-1
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ color: "#69f" })
    );
    sprite.position.set(6, 5, 5);
    sprite.scale.set(2, 5, 1);
    sprite.name = "sprite-1";
    this.Group.add(sprite);

    //add sprites-1
    const sprite2 = new THREE.Sprite(
      new THREE.SpriteMaterial({ color: "green" })
    );
    //sprite.material.rotation = Math.PI/3*4; //等同于(Math.PI/3)*4逆时针旋转240度
    sprite2.position.set(8, -2, 2); //感觉position的位置是精灵的中心在三维坐标中的位置
    sprite2.center.set(0.5, 0.5); //精灵的center设定是基于精灵的大小的，精灵的的左下角为（0,0），x轴的右边与y轴的上方为正
    sprite2.scale.set(1, -5, 1);
    sprite2.name = "sprite-2";
    this.Group.add(sprite2);

    const Group2 = new THREE.Object3D();
    //group2.scale.set(1,2,1);
    Group2.position.set(-5, 0, 0);
    //group2.rotation.set(Math.PI/2,0,0);
    this.Group.add(Group2);

    //var sprite = new THREE.Sprite(new THREE.SpriteMaterial({color:"#69f",name:"hihi"}));
    const sprite3 = new THREE.Sprite(
      new THREE.SpriteMaterial({ color: "#69f" })
    );
    sprite3.position.set(0, 2, 5);
    sprite3.scale.set(20, 2, 1);
    sprite3.name = "sprite-3";

    //sprite.center.set(-0.1,0);
    //sprite.material.rotation = Math.PI/3;
    Group2.add(sprite3);

    // 将几何体和材料依附于网线
    this.Cube = new THREE.Mesh(geometry, material);
    this.Scene.add(this.Cube);

    this.Render.setSize(
      (this.$refs.container as any).clientWidth,
      (this.$refs.container as any).clientHeight
    );
    (this.$refs.container as Element).appendChild(this.Render.domElement);
    this.animate();

    (this.$refs.container as any).addEventListener(
      "click",
      this.handleClick,
      false
    );
  }

  animate(): void {
    this.animateCount = requestAnimationFrame(() => this.animate());
    this.Cube.rotation.x += 0.01;
    this.Cube.rotation.y += 0.01;
    this.Controller.update();
    this.Render.render(this.Scene, this.Camera);
  }

  handleClick(event: any) {
    event.preventDefault();
    if (this.SelectedObj) {
      console.log(this.SelectedObj);
      (this.SelectedObj as any).material.color.set("#69f");
      this.SelectedObj = null;
    }

    const intersects = this.getIntersects(
      event.layerX,
      event.layerY,
      this.Group
    );
    if (intersects.length > 0) {
      const res = intersects.filter(function(res) {
        return res && res.object;
      })[0];
      if (res && res.object) {
        this.SelectedObj = res.object;
        this.$notification.open({
          message: "选中的Object",
          description: this.SelectedObj.name
        });
        this.SelectedObj.material.color.set("#ffc466");
      }
    }
  }

  onWindowResize(): void {
    (this.Camera as any).aspect =
      (this.$refs.container as any).clientWidth /
      (this.$refs.container as any).clientHeight;
    (this.Camera as any).updateProjectionMatrix();
    this.Render.setSize(
      (this.$refs.container as any).clientWidth,
      (this.$refs.container as any).clientHeight
    );
  }

  getIntersects(x: number, y: number, obj?: any): THREE.Intersection[] {
    //将鼠标位置转换成设备坐标。x和y方向的取值范围是(-1 to 1)
    this.Mouse.x = (x / (this.$refs.container as any).clientWidth) * 2 - 1;
    this.Mouse.y = -(y / (this.$refs.container as any).clientHeight) * 2 + 1;

    //通过摄像机和鼠标位置更新射线
    this.Raycaster.setFromCamera(this.Mouse, this.Camera);
    if (obj === undefined) {
      return [];
    }

    // 返回物体和射线的焦点
    return this.Raycaster.intersectObject(obj, true);
  }
}
</script>
