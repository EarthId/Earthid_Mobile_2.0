import axios from "axios"
import { newssiApiKey } from "./earthid_account";


export function createUserSignaturekey (url:any,params:any,headersToSend:any){

    return new Promise((reslove:any,reject:any)=>{
        axios.post(url, params, { headers: headersToSend })
        .then((response)=>{
          
            reslove(response.data)
        })
        .catch((e)=>console.log(e,"createUserSignaturekey"))
    })
}

export function postApi(url:any, params:any, headersToSend:any){
    return new Promise((resolve:any,reject:any)=>{
        axios.post(url,params,{headers: headersToSend})
        .then(res=>{
            resolve(res.data)
        })
        .catch(e=>{
            console.log(e)
            reject(e)
        })
    })
}