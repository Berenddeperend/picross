<template>
  <teleport to="#modal-target">
    <transition name="fade">
      <div class="backdrop" v-if="visible" @click.self="$emit('close')">
        <div class="modal">
          <slot></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
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
  width: 230px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  // height: 200px;
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
  z-index: 100;
}


// .fade-enter-active,
// .fade-leave-active {
//   transition: opacity 0.5s ease;
// }

// .fade-enter-from,
// .fade-leave-to {
//   opacity: 0;
// }
</style>
