<template>
  <teleport to="#modal-target">
    <transition>
      <div class="backdrop" v-if="visible" @click.self="$emit('close')">
        <div class="modal">
          <slot></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { onKeyStroke } from "@vueuse/core";

const emit = defineEmits<{ (e: "close"): void }>();
const { visible } = defineProps<{ visible: boolean }>();

onKeyStroke("Escape", () => {
  if (!visible) return;
  emit("close");
});
</script>

<style lang="scss" scoped>
.modal {
  background: white;
  width: 200px;
  height: 200px;
  padding: 20px;
}

.backdrop {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
}
</style>
