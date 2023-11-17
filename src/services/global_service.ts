import store from '@/store';

function showLoading(){
    store.dispatch('showLoading');
}

function hideLoading(){
    store.dispatch('hideLoading');
}
function showToast(message: string){
    store.dispatch('showToast', message)
}

function hideToast(){
    store.dispatch('hideToast');
}


export default {showToast, showLoading, hideLoading, hideToast};