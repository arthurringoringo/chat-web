import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import ChatPage from "@/views/ChatPage.vue";
import HomePage from "@/views/HomePage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/chat_room/:id',
    name: 'Chat',
    component: ChatPage
  },
  {
    path: "/",
    name: "Home",
    component: HomePage,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
