import axios from "axios";
import { useAppSelector } from "../hooks/hooks";


export function createVerifiableCred(requesturl:any,params:any,headersToSend:any){

    return new Promise((reslove:any,reject:any)=>{
        axios.post(requesturl, params, { headers: headersToSend })
        .then((response)=>{
           
            reslove(response.data)
        })
        .catch((e)=>console.log(e.message,"createVerifiableCred"))
    })
}