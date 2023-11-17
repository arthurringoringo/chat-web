<script setup lang="ts">
import {IonPopover,IonButton,IonList,IonNote,IonItem,IonFooter,IonText,IonLabel,IonHeader, IonPage, IonTitle, IonToolbar, IonContent, IonButtons, IonMenuButton, IonInput} from '@ionic/vue';
import {onMounted, ref, onUpdated} from "vue";
import global_service from "@/services/global_service";
import {ChatRoomDetails, getUser, IndexChatRoomMessages, IndexUser, SendMessage} from "@/services/api_service";
import {useRoute} from "vue-router";
const roomChatDetails = ref();
const roomChatMessages = ref();
const route = useRoute();
const messageInput = ref("");
const chatListRef = ref(null);

import ActionCable from 'actioncable';


onMounted(async() => {
  await GetChatRoomDetails();
  await GetChatRoomMessages();
  chatListRef.value = document.querySelector('.chat-list');
})

onUpdated(() => {
  // Scroll to the bottom when new messages are added
  if (chatListRef.value) {
    chatListRef.value.scrollTop = chatListRef.value.scrollHeight;
  }});
async function GetChatRoomDetails(): Promise<void>{
  global_service.showLoading();
  if(!roomChatDetails.value) {
    const response = await ChatRoomDetails(route.params.id);
    if (response) {
      roomChatDetails.value = response;
      global_service.hideLoading();
    } else {
      global_service.hideLoading();
      global_service.showToast(response.message);
    }
  }
}

async function GetChatRoomMessages(): Promise<void>{
  global_service.showLoading();
  if(!roomChatMessages.value) {
    const response = await IndexChatRoomMessages(route.params.id);
    if (response) {
      roomChatMessages.value = response;
      global_service.hideLoading();
    } else {
      global_service.hideLoading();
      global_service.showToast(response.message);
    }
  }
}

async function sendNewChat(): Promise<void>{
  const body = {text: messageInput.value, room_id: route.params.id, sender_id: getUser().id}
  const response = await SendMessage(body);
  if (response) {
    messageInput.value = "";
  } else {
    global_service.showToast(response.message);
    }
}

const cable = ActionCable.createConsumer('ws://0.0.0.0:3000/cable'); // Replace with your server URL

const channel = cable.subscriptions.create( { channel: 'ChatChannel', user_id: getUser().id }, {
  connected() {
    console.log('WebSocket Connected');
  },
  disconnected() {
    console.log('WebSocket Disconnected');
  },
  received(data) {
    if (data.room_id == route.params.id){
      roomChatMessages.value.push(data)
    }
  },
});

</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
      </ion-buttons>
      <ion-title id="hover-trigger">{{ roomChatDetails?.name }}</ion-title>
      <ion-popover trigger="hover-trigger" trigger-action="hover" size="auto">
        <ion-content class="ion-padding">
          <ion-list>
            <ion-item>
              <ion-label> Created by: </ion-label>
              <ion-text>{{ roomChatDetails?.created_by }} </ion-text>
            </ion-item>
              <ion-text v-for="(p,i) in roomChatDetails?.room_members" :key="i">
                <ion-text> |{{ p.username }}| </ion-text>
              </ion-text>
          </ion-list>
        </ion-content>
      </ion-popover>
    </ion-toolbar>
  </ion-header>
    <ion-content class="chat-content" :scrollEvents="false">
      <ion-list ref="chatList" class="chat-list" :inset="true">
        <ion-item v-for="(p,i) in roomChatMessages" :key="i">
          <ion-text slot="end" v-if="p.sender.id == getUser().id">{{p?.text}}</ion-text>
          <ion-badge slot="start" color="tertiary" v-else="">{{p?.sender.username}}</ion-badge>
          <ion-badge slot="end" color="primary" v-if="p.sender.id == getUser().id">{{p?.sender.username}}</ion-badge>
          <ion-text slot="start" v-else="">{{p?.text}}</ion-text>
          <ion-note slot="end">{{p?.created_at}}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-item>
        <ion-input
            v-model="messageInput"
            placeholder="Type a message..."
            @keyup.enter="sendNewChat()"
        ></ion-input>
        <ion-button @click="sendNewChat()">Send</ion-button>
      </ion-item>
    </ion-footer>
  </ion-page>
</template>

<style scoped>
.chat-content {
  height: 100%;
  overflow-y: auto;
}
</style>