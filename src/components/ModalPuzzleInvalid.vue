<template>
  <the-modal :visible="open" @close="emit('close')">
    <p>De puzzel is niet goed.</p>
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
