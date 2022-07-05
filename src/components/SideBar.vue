<template>
  <aside class="sidebar">
    <slot name="default"></slot>

    <div class="sidebar-footer">
      <slot name="footer"></slot>
    </div>
  </aside>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background: #f7f7f7;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-footer {
  display: flex;

  justify-content: space-between;

  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  border-top: 1px solid gray;
}

input {
  position: absolute;
  top: 60px;
}

ul {
  display: flex;
  padding: 0;
  margin: 0 10px;

  li {
    margin: 5px;
    list-style-type: none;
    padding: 4px 10px;
    border-radius: 3px;

    &.current-player {
      background: lightblue;
    }
  }
}
</style>
