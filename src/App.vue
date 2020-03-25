<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}
</style>

<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class App extends Vue {
  public mounted(): void {
    interface ConsoleOption {
      title: string;
      content: string;
      backgroundColor: string;
    }

    /**
     * @param {option.title} 标题
     * @param {option.content} 内容
     * @param {option.backgroundColor} 内容背景色
     */
    function Console(option: ConsoleOption): void {
      const title = option.title;
      const content = option.content;
      const backgroundColor = option.backgroundColor;
      const arg = [
        "%c ".concat(title, " %c ").concat(content, " "),
        "padding: 1px; border-radius: 3px 0 0 3px; color: #fff; background: ".concat(
          "#606060",
          ";"
        ),
        "padding: 1px; border-radius: 0 3px 3px 0; color: #fff; background: ".concat(
          backgroundColor,
          ";"
        )
      ];
      window.console &&
        typeof window.console.log === "function" &&
        window.console.log.call(null, ...arg);
    }
    Console({
      title: "项目环境",
      content: process.env.NODE_ENV,
      backgroundColor: "#1475b2"
    });
    Console({ title: "Version", content: "1.0.0", backgroundColor: "#42c02e" });
    Console({
      title: "Vue-TypeScript",
      content: `${new Date().toISOString()}`,
      backgroundColor: "#42c02e"
    });
  }
}
</script>
