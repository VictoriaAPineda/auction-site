'use client'
import supabase from "@/app/config/supabaseClient"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { AuctionItem } from "@/app/items/page"
import Image from "next/image"

const ItemDetails = () => {
    const [data, setData] = useState<AuctionItem>({itemId:"",itemName:"",condition:"",category:"",certified:false,startPrice:0,image:"",description:"",user_id: ""})
    
    const {id} = useParams()
 
    useEffect(()=>{
        const fetchItem = async () => {
            const {data, error} = await supabase
                .from('auction_Items')
                .select()
                .eq('itemId', id)
                .single()
            if(error){
                console.log(error)
            }
            if(data){
               setData(data)
               console.log(data)
            }
        }
        fetchItem()
    },[id])

    return(
        <section id="itemDetailsPage">
            <h1>Details Items Page</h1>
            <p>{data.itemId}</p>
            <p>{data.itemName}</p>
            <p>{data.startPrice}</p>
            <p>{data.category}</p>
            <p>{data.certified}</p>
            <p>{data.condition}</p>
            <p>{data.description}</p>
            <Image src={data.image} alt="item image" width={150} height={150} loading="eager" className="itemImage" />

          
        </section>
    )
}
export default ItemDetails;