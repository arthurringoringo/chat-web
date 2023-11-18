export const API_ENDPOINT = 'https://chat-api.arthurringo.com';
import store from '@/store';
import {computed, ComputedRef} from 'vue';
import {ApiError} from "@/utils/custom_error";
import global_service from "@/services/global_service";

const currentUser = computed(() => store.getters.currentUser);

export function getUser(): {id: number, username: string }  {
    return currentUser.value;
}

export function storeUser(user: Record<string, any>): void{
    store.dispatch("storeUser", user)
}
// Global api function call helper

export async function callApi({
  route,
  method,
  body= null
}: {
    route: string;
    method: string;
    body?: Record<string,any> | null;
}): Promise<Response> {
    const url = API_ENDPOINT+"/" + route;
    const headers = {
        'Content-Type': "application/json"
    }
    const options: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    };
    return await fetch(url, options);

//     handle error in service
}

export async function IndexUser(): Promise<Promise<any> | Promise<ApiError>>{
    try {
        const response =  await callApi({route: "users",method: "GET"});
        const json_response = await response.json()
        if (!response.ok) {
            return new ApiError(json_response.error);
        } else {
            return json_response;
        }
    } catch (error: ApiError | any) {
        global_service.hideLoading()
        global_service.showToast(error.message)
        console.log("API REQUEST ERROR: " + error.message)
    }
}

export async function IndexChatRoom(): Promise<Promise<any> | Promise<ApiError>>{
    try {
        const response =  await callApi({route: "chat_rooms",method: "GET"});
        const json_response = await response.json()
        if (!response.ok) {
            return new ApiError(json_response.error);
        } else {
            return json_response;
        }
    } catch (error: ApiError | any) {
        global_service.hideLoading()
        global_service.showToast(error.message)
        console.log("API REQUEST ERROR: " + error.message)
    }
}

export async function IndexChatRoomMessages(id: string | string[]): Promise<Promise<any> | Promise<ApiError>>{
    try {
        const response =  await callApi({route: "chat_room/"+ id +"/messages",method: "GET"});
        const json_response = await response.json()
        if (!response.ok) {
            return new ApiError(json_response.error);
        } else {
            return json_response;
        }
    } catch (error: ApiError | any) {
        global_service.hideLoading()
        global_service.showToast(error.message)
        console.log("API REQUEST ERROR: " + error.message)
    }
}

export async function ChatRoomDetails(id: string | string[]): Promise<Promise<any> | Promise<ApiError>>{
    try {
        const response =  await callApi({route: "chat_rooms/"+id,method: "GET"});
        const json_response = await response.json()
        if (!response.ok) {
            return new ApiError(json_response.error);
        } else {
            return json_response;
        }
    } catch (error: ApiError | any) {
        global_service.hideLoading()
        global_service.showToast(error.message)
        console.log("API REQUEST ERROR: " + error.message)
    }
}

export async function ChatAs(body: Record<string,string>): Promise<Promise<any> | Promise<ApiError>>{
    try {
        const response =  await callApi({route: "chat_as",method: "POST", body: body});
        const json_response = await response.json()
        if (!response.ok) {
            return new ApiError(json_response.error);
        } else {
            storeUser(json_response);
            return json_response;
        }
    } catch (error: ApiError | any) {
        global_service.hideLoading()
        global_service.showToast(error.message)
        console.log("API REQUEST ERROR: " + error.message)
    }
}

export async function NewChatRoom(body: Record<string,string>): Promise<Promise<any> | Promise<ApiError>>{
    try {
        const response =  await callApi({route: "/chat_rooms",method: "POST", body: body});
        const json_response = await response.json()
        if (!response.ok) {
            return new ApiError(json_response.error);
        } else {
            return json_response;
        }
    } catch (error: ApiError | any) {
        global_service.hideLoading()
        global_service.showToast(error.message)
        console.log("API REQUEST ERROR: " + error.message)
    }
}

export async function SendMessage(body: Record<string,string>): Promise<Promise<any> | Promise<ApiError>>{
    try {
        const response =  await callApi({route: "messages",method: "POST", body: body});
        const json_response = await response.json()
        if (!response.ok) {
            return new ApiError(json_response.error);
        } else {
            return json_response;
        }
    } catch (error: ApiError | any) {
        global_service.hideLoading()
        global_service.showToast(error.message)
        console.log("API REQUEST ERROR: " + error.message)
    }
}

export async function JoinedChatRoom(id: number): Promise<Promise<any> | Promise<ApiError>>{
    try {
        const response =  await callApi({route: "user/" + id + "/chat_room",method: "GET",});
        const json_response = await response.json()
        if (!response.ok) {
            return new ApiError(json_response.error);
        } else {
            return json_response;
        }
    } catch (error: ApiError | any) {
        global_service.hideLoading()
        global_service.showToast(error.message)
        console.log("API REQUEST ERROR: " + error.message)
    }
}

export async function JoinRoomChat(id: number, user_id: number): Promise<Promise<any> | Promise<ApiError>>{
    try {
        const response =  await callApi({route: "chat_rooms/join/" +id,method: "POST", body: {user_id: user_id}});
        const json_response = await response.json()
        if (!response.ok) {
            return new ApiError(json_response.error);
        } else {
            return json_response;
        }
    } catch (error: ApiError | any) {
        global_service.hideLoading()
        global_service.showToast(error.message)
        console.log("API REQUEST ERROR: " + error.message)
    }
}
