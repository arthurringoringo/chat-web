<template>
  <ion-content>
    <ion-list id="inbox-list">
      <ion-list-header> Chatting as {{currentUser()}}</ion-list-header>
      <ion-note> Welcome {{currentUser()}}</ion-note>

      <ion-menu-toggle :auto-hide="false" v-for="(p, i) in chatRoomResponse" :key="i">
        <ion-item @click="selectedIndex = i" router-direction="root" :router-link='"/chat_room/"+p?.id' lines="none" :detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
          <ion-label>{{ p.name }}</ion-label>
        </ion-item>
      </ion-menu-toggle>
      <ion-button expand="block" @click="router.push('/')">Home</ion-button>
      <ion-button expand="block" color="secondary" @click="openModal(true)">Join Room</ion-button>
      <ion-item>
        <ion-input label="Change User:" :placeholder="currentUser()" v-model="usernameInput" @keyup.enter="ChangeUser()"></ion-input>
        <ion-button expand="block" @click="ChangeUser()"> submit </ion-button>
      </ion-item>
    </ion-list>

    <ion-modal :is-open="isModalOpen" @didDismiss="openModal(false)" >
      <ion-header>
        <ion-toolbar>
          <ion-title> Join Chat Room </ion-title>
          <ion-buttons slot="end">
            <ion-button @click="openModal(false)">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-list>
          <ion-item v-for="(p,i) in allChatRoomResponse" :key="i">
            <ion-label>{{ p?.name }}</ion-label>
            <ion-button @click="JoinChatRoom(p?.id)">Join</ion-button>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-modal>

  </ion-content>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuToggle,
  IonNote,
  IonInput,
  IonButton, IonTitle, IonHeader, IonToolbar, IonModal, IonButtons
} from '@ionic/vue';
import {onMounted, reactive, ref} from 'vue';
import global_service from "@/services/global_service";
import {ChatAs, getUser, IndexChatRoom, IndexUser, JoinedChatRoom, JoinRoomChat} from "@/services/api_service";
import router from "@/router";
const selectedIndex = ref(0);
const usernameInput = ref("");
const responseIndex = ref();
const chatRoomResponse = ref();
const allChatRoomResponse = ref();
const isModalOpen = ref(false);
const openModal = (open:boolean) => {
  isModalOpen.value = open;
}

// const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
//


onMounted(async() => {
  global_service.showLoading();
  await IndexUsers();
  if (!getUser()) {
  } else {
    await GetJoinedChatRoom();
  }
  await GetChatRoom();
  global_service.hideLoading();

})

function currentUser(): string{
  if(getUser()){
    return getUser().username;
  }
  else {
    return "User Not Set"
  }
}

async function IndexUsers(): Promise<void>{
  if(!responseIndex.value) {
    const response = await IndexUser();
    if (response) {
      responseIndex.value = response;
    } else {
      global_service.hideLoading();
      global_service.showToast(response.message);
    }
  }
}

async function ChangeUser(): Promise<void>{
  global_service.showLoading();
  const body = { username: usernameInput.value }
  const response = await ChatAs(body);
  if (response) {
    chatRoomResponse.value = await JoinedChatRoom(getUser().id);
    global_service.hideLoading();
    // location.reload(true);

  } else {
    global_service.hideLoading();
    global_service.showToast(response.message);
  }
}

async function GetJoinedChatRoom(): Promise<void>{
  if(!chatRoomResponse.value) {
    const response = await JoinedChatRoom(getUser().id);
    if (response) {
      chatRoomResponse.value = response;

    } else {
      global_service.hideLoading();
      global_service.showToast(response.message);
    }
  }
}


async function GetChatRoom(): Promise<void>{
  if(!allChatRoomResponse.value) {
    const response = await IndexChatRoom();
    if (response) {
      allChatRoomResponse.value = response;

    } else {
      global_service.hideLoading();
      global_service.showToast(response.message);
    }
  }
}

async function JoinChatRoom(id: number): Promise<void>{
  global_service.showLoading();
  const response = await JoinRoomChat(id, getUser().id);
  if (response) {
    chatRoomResponse.value = await JoinedChatRoom(getUser().id);
    global_service.hideLoading();
  } else {
    global_service.hideLoading();
    global_service.showToast(response.message);
  }
}

// const path = window.location.pathname.split('/')[1];
// if (path !== undefined) {
//   selectedIndex.value = chatRoomResponse.value.findIndex((page) => page?.id === path);
// }
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
