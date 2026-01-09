'use client'

import { useContext, useEffect, useState } from "react"
import { Session } from "../context/SessionContext"
import supabase from "../config/supabaseClient";


export default function UserProfile () {

    const [data, setData] = useState()
    
    
    const sesssion = useContext(Session);
    console.log(sesssion.session)
    {/* user is displayed thier own items / purchases / sells*/}

    // useEffect(()=>{
    //     const fetchUserItems = async () => {
    //     //     const {data, error} = await supabase
    //     //     .from('auction_Items')
    //     //     .select()
    //     //     .eq('id', id)
    //     //     .single()
    //     // if(error){
    //     //     console.log(error)
    //     // }
    //     // if(data){
    //     //    setData(data)
    //     //    console.log(data)
    //     // }
    // }
    //     fetchUserItems()
         
    // },[])

    return(
        <div>

            <p>{`User Profile: `}</p>
        </div>
    )
}