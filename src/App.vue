<script setup lang="ts">
import {ref} from 'vue'

const theme = ref('light');

</script>

<template>
  <div>
    <router-view></router-view>
    <div id="modal-target"></div>
  </div>
</template>
