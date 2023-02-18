<template>
  <the-modal :visible="open" @close="emit('close')">
    <p>Sorry, your drawing couldn't be converted to a puzzle that's solvable without backtracking/guessing. Please make some changes and try again.</p>
  </the-modal>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import TheModal from "@/components/TheModal.vue";

const emit = defineEmits<{ (e: "close"): void }>();

const { open } = defineProps<{
  open: Ref<boolean>;
}>();
</script>
