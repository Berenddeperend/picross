<script setup lang="ts">
import { Ref, ref, toRef, toRefs } from "vue";
import http from "@/services/http";
import TheModal from "@/components/TheModal.vue";
import { useStorage } from "@vueuse/core";

const emit = defineEmits<{ (e: "close"): void }>();
const puzzleName = ref<string>("");
const nickName = useStorage("nickName", "");
const response = ref<string>();

const props = defineProps<{
  open: boolean;
  grid: Grid;
}>();

const { grid, open } = toRefs(props);

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
      emit("close");
    })
    .catch((err) => {
      if (err.response.status) {
        response.value = "You've already submitted the same puzzle before.";
        setTimeout(() => {
          emit("close");
          response.value = "";
        }, 2000);
      }
    });
}
</script>

<template>
  {{ grid[0].length }}
  <TheModal :visible="open" @close="emit('close')">
    <form @submit.prevent="onSubmit" v-if="!response">
      <input type="text" placeholder="Your name" v-model="nickName" />
      <input type="text" placeholder="Puzzle name" v-model="puzzleName" />
      <button :disabled="puzzleName === '' || nickName === ''">Save</button>
    </form>

    <p v-else>{{ response }}</p>
  </TheModal>
</template>
