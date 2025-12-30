'use client'
import ItemCard from "../components/ItemCard";
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

/* Properties of each Auction Item */
export interface AuctionItem {
    id: string 
    itemName: string
    condition: string
    category: string
    certified: boolean
    startPrice: number
    image: string
    description: string
}
/* This page will display a gallery of items that will run in auction */
export default function Items () {
    const [fetchError, setFetchError] = useState<any>(null)
    const [items, setItems] = useState<any>(null)

    useEffect(()=>{
        const fetchItems = async () => {
            const {data, error} = await supabase
                .from('auction_Items')
                .select()
                if(error){
                    setFetchError('Could not fetch')
                    setItems(null)
                    console.log(error)
                }
                if (data) {
                    setItems(data)
                    setFetchError(null)
                }
        }
        fetchItems()
    },[])
    return(
        <section>
            {/* Error Message for data */}
            {fetchError && (<p>{fetchError}</p>)}
            {items &&(
                <div>
                    {/* Array of items for Auction */}
                    <div>
                        {items.map( (item: AuctionItem) =>(
                            <ItemCard key={item.id} itemData={item} />
                        ))}
                    </div>
                </div>
            )}
        </section>
    )  
}