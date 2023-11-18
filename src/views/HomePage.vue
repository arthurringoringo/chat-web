<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Chat App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="container">
        <strong class="capitalize">Select a chat, create or join a chat room</strong>
      </div>
      <ion-button expand="block" color="secondary" @click="openModal(true)">Create Chat Room</ion-button>

      <ion-modal :is-open="modalOpen" @didDismiss="openModal(false)" >
        <ion-header>
          <ion-toolbar>
            <ion-title> New Chat Room </ion-title>
            <ion-buttons slot="end">
              <ion-button @click="openModal(false)">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list>
            <ion-item>
              <ion-input labelPlacement="floating" label="Name"  v-model="newChatRoomNameInput"></ion-input>
            </ion-item>
          </ion-list>
          <ion-button expand="block" color="secondary" @click="CreateNewChatRoom()" > Create Room </ion-button>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonContent,
  IonHeader, IonInput, IonItem,
  IonList, IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
    IonModal,
    IonButton,
    IonSplitPane,
    IonMenu,
} from '@ionic/vue';

import { ref } from 'vue';
import router from "@/router";
import global_service from "@/services/global_service";
import {ChatAs, getUser, NewChatRoom} from "@/services/api_service";
const newChatRoomNameInput = ref("")
const modalOpen = ref(false)

const openModal = (open:boolean) => {
  modalOpen.value = open;
  newChatRoomNameInput.value = "";
}
async function CreateNewChatRoom(): Promise<void>{
  global_service.showLoading();
  const body: Record<string, any> = { name: newChatRoomNameInput.value, user_id: getUser().id}
  const response = await NewChatRoom(body);
  if (response) {
    global_service.hideLoading();
    openModal(false);
    location.reload();
  } else {
    global_service.hideLoading();
    global_service.showToast(response.message);
  }
}

//
// const refresh = (ev: CustomEvent) => {
//   setTimeout(() => {
//     ev.detail.complete();
//   }, 3000);
// };
</script>
