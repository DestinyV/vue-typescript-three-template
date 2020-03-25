<style lang="less">
.home {
  .logo {
    width: 256px;
  }
}
</style>

<template>
  <div class="home">
    <keep-alive>
      <Three msg="Welcome to Your Three.js App" />
    </keep-alive>
  </div>
</template>

<script>
import Three from "@/components/Three.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    Three
  }
})
export default class Home extends Vue {}
</script>
