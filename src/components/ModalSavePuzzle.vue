<template>
  <the-modal :visible="open" @close="emit('close')">
    <form @submit.prevent="onSubmit" v-if="!response">
      <input type="text" placeholder="Uw naam" v-model="nickName" />
      <input type="text" placeholder="Puzzel naam" v-model="puzzleName" />
      <button :disabled="puzzleName === '' || nickName === ''">Save</button>
    </form>

    <p v-else>{{ response }}</p>
  </the-modal>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import http from "@/services/http";
import TheModal from "@/components/TheModal.vue";
import { useStorage } from "@vueuse/core";

const emit = defineEmits<{ (e: "close"): void }>();
const puzzleName = ref<string>("");
const nickName = useStorage("nickName", "");
const response = ref<string>();

const { grid, open } = defineProps<{
  open: Ref<boolean>;
  grid: Ref<Grid>;
}>();

function onSubmit(e: Event) {
  http
    .post("/puzzle", {
      name: puzzleName.value,
      solution: JSON.stringify(grid),
      authorName: nickName.value,
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
