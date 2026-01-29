'use client'
import ItemCard from "../components/ItemCard";
import supabase from "../config/supabaseClient";
import { use, useEffect, useState } from "react";
import filterMenus from "../data/filterMenu.json";
import AccordionFilter from "../components/AccordionFilter";

/* Properties of each Auction Item */
export interface AuctionItem {
    itemId: string 
    itemName: string
    condition: string
    category: string
    certified: boolean
    startPrice: number
    image: string
    description: string
    user_id: string
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

    /* Real-Time Update the gallery of added items without need to refresh page */
    useEffect(()=>{
        const channel = supabase.channel('auction-channel');
        channel
            .on(
                "postgres_changes",
                {event: "INSERT", schema :"public", table: "auction_Items"},
                (payload) => {
                    const newItem = payload.new as AuctionItem;
                    setItems((prev:any) => [...prev, newItem]);
                }
            ).subscribe((status) => {
                console.log("Subscription: " , status)
            })
    },[])
    
    return(
        <section id="itemGallery">

            {/* side menu to display filters for galllery [wip]*/}
            <div className="filter-side-menu">
                { filterMenus.map(({filter, subfilter}) => (
                    <div key={filter}>
                        <AccordionFilter filterType={filter} subfilter={subfilter}/>
                    </div>
                ))}
            </div>
            
            <div className="item-container">
                {/* Error Message for data */}
                {fetchError && (<p>{fetchError}</p>)}
                {items &&(
                    <div className="item_container_grid">
                        {/* Array of items for Auction */}
                        {items.map( (item: AuctionItem) =>(
                            <ItemCard key={item.itemId} itemData={item} />
                        ))}
                    </div>
                )}
            </div>
           
        </section>
    )  
}