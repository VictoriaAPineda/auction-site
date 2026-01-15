'use client'

import { useContext, useEffect, useState } from "react"
import { Session } from "../context/SessionContext"
import supabase from "../config/supabaseClient";
import { AuctionItem } from "../items/page";

async function getUserid() {
    const {data: {user}, error} = await supabase.auth.getUser()
    return user.id 
}

const uid = await getUserid();

export default function UserProfile () {

    const [data, setData] = useState<any>([])
   
    {/* retrive user's own items*/}
    useEffect(()=>{
        const fetchUserItems = async () => {
            const {data, error} = await supabase
            .from('auction_Items')
            .select()
            .eq('user_id', uid)
        if(error){
            console.log("Error: " ,error)
        }
        if(data){
           setData(data)
           console.log(data)
        }
    }
        fetchUserItems()
    },[])

    {/* delete */}
    const removeItem = async (idOfItem:string) =>{
        console.log(idOfItem)
        const {error} = await supabase
            .from('auction_Items')
            .delete()
            .eq('itemId', idOfItem)
        if(error){
            console.log("Error during item removal: ", error.message)
            return
        }
    }

    return(
        <div>

            <p>{`User Profile: `}</p>
            <div>
                { data && (
                    <div>
                        {/* TODO: Item Table format */}
                        { data.map((data : AuctionItem)=>(
                            <div key={data.itemId}>
                                <button onClick={()=>removeItem(data.itemId)} >Remove item from auction</button>
                                <p>{data.user_id}</p>
                                <p>{data.itemName}</p>
                                <p>- - -</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}