// store/index.js or store/index.ts
// import Vuex from 'vuex'
import { createStore } from 'vuex';
import createPersistedState from "vuex-persistedstate";

export default createStore({
    state: {
        isLoading: false,
        toastMessage: '',
        currentUser: null,
    },
    mutations: {
        setLoading(state, isLoading: boolean) {
            state.isLoading = isLoading;
        },
        setToastMessage(state, message: string) {
            state.toastMessage = message;
        },
        setCurrentUser(state, user: Record<any, any>) {
            state.currentUser = user;
        },
        clearCurrentUser(state) {
            state.currentUser = null;
        },
    },
    actions: {
        showLoading({ commit }) {
            commit('setLoading', true);
        },
        hideLoading({ commit }) {
            commit('setLoading', false);
        },
        showToast({ commit }, message: string) {
            commit('setToastMessage', message);
        },
        hideToast({ commit }) {
            commit('setToastMessage', '');
        },
        storeUser({ commit }, user){
            commit('setCurrentUser', user)
        },
        removeUser({commit}){
            commit('clearCurrentUser')
        },
    },
    getters: {
        isLoading: (state) => state.isLoading,
        toastMessage: (state) => state.toastMessage,
        currentUser: (state) => state.currentUser,
    },
    plugins: [
        createPersistedState({
            paths: ['currentUser'],
        })
    ]
});
