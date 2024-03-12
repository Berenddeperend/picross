<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import http from "@/services/http";
import TheModal from "@/components/TheModal.vue";
import { useStorage } from "@vueuse/core";

const emit = defineEmits<{ (e: "close"): void }>();
const puzzleName = ref<string>("");
const nickName = useStorage("nickName", "");

const saved = ref(false);
const message = ref("");

const props = defineProps<{
  open: boolean;
  grid: Grid;
}>();

const { grid, open } = toRefs(props);

watch(open, (isOpen) => {
  if (isOpen) {
    saved.value = false;
    message.value = "";
  }
});

function onSubmit(e: Event) {
  console.log(grid.value[0].length);
  http
    .post("/puzzle", {
      name: puzzleName.value,
      solution: JSON.stringify(grid.value),
      authorName: nickName.value,
      width: grid.value[0].length,
      height: grid.value[0].length, //only support square puzzles
    })
    .then((res) => {
      saved.value = true;
      message.value = "Thank you for submitting a puzzle! <3";
    })
    .catch((err) => {
      if (err.response.status) {
        message.value = "You've already submitted the same puzzle before.";
        setTimeout(() => {
          emit("close");
          message.value = "";
        }, 2000);
      }
    });
}
</script>

<template>
  <TheModal :visible="open" @close="emit('close')">
    <form @submit.prevent="onSubmit" v-if="!message">
      <input type="text" placeholder="Your name" v-model="nickName" />
      <input type="text" placeholder="Puzzle name" v-model="puzzleName" />
      <button :disabled="puzzleName === '' || nickName === ''">Save</button>
    </form>

    <p v-else>{{ message }}</p>
  </TheModal>
</template>
