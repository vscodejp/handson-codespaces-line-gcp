<template>
  <div id="app">
    <Liff />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Liff from "./components/Liff.vue";

export default Vue.extend({
  name: "App",
  components: {
    Liff
  }
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
.container {
  padding: 0 15px 0 15px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 6px);
}
#canvas-wrapper {
  width: 100%;
  flex-grow: 1;
}
#btns {
  display: flex;
  justify-content: center;
  padding: 10px;
}
.btn {
  display: inline-block;
  padding: 6px 12px;
  margin: 0 4px 0 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  border: none;
  border-radius: 4px;
  color: #ffffff;
}
.btn.btn-primary {
  background-color: #27ae60;
}
.btn.btn-info {
  background-color: #2ecc71;
}
</style>