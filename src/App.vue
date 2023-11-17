<template>
  <ion-app>
    <ion-split-pane content-id="main-content" v-if="!$route.meta.hideNavbar">
      <ion-menu content-id="main-content" type="overlay">
        <ChatMenu/>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
    <ion-router-outlet id="main-content" v-else></ion-router-outlet>
    <ion-loading :is-open="isLoading" keyboard-close="true" message="Loading..."> </ion-loading>
    <ion-toast :is-open="!!toastMessage" :message="toastMessage" :duration="2500" @didDismiss="global_service.hideToast"></ion-toast>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonLoading, IonToast,IonMenu,IonSplitPane } from '@ionic/vue';
import ChatMenu from "@/components/ChatMenu.vue";
import global_service from "@/services/global_service";
import {computed} from "vue";
import store from "@/store";
const isLoading = computed(()=> store.getters.isLoading);
const toastMessage = computed(()=> store.getters.toastMessage);

</script>
