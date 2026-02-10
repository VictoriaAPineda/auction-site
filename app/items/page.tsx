'use client'
import ItemCard from "../components/ItemCard";
import supabase from "../config/supabaseClient";
import { useEffect, useMemo, useState } from "react";

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
    const [selectedFilters, setSelectedFilters] = useState<any>({categories:[], rooms:[]})
    const [categories, setCategories] = useState([])
    const [rooms, setRooms] = useState([])


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

    /* scans and returns no repeat of values of the data source (supabase db) and field(column name from db) */
    const getUniqueFilterOptions = (data, field) => {
        return [...new Set(data.map(i => i[field]))]
       
    }
    /* after scanning db for unique values, use these to create checkbox list*/
    useEffect(()=>{
        if(items){
            setCategories(getUniqueFilterOptions(items, 'category'))
            setRooms(getUniqueFilterOptions(items, 'auctionRoom'))
        }
    },[items])

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
    
    const handleFilterSelection = (e, filterType) => {
        const {value, checked} = e.target;

        setSelectedFilters( prevFilters => {
            const currFilters = prevFilters[filterType]
            if(checked){
                return {...prevFilters, [filterType]:[...currFilters,value]} 
            }else{
                return{...prevFilters, [filterType]:currFilters.filter(f=>f !=value) }
            }
        })
    }

    const filterItems = useMemo (()=> {
        if(items){
            return items.filter( i => {
                const categoryMatch = selectedFilters.categories.length === 0 ||
                    selectedFilters.categories.includes(i.category)

                const roomMatch = selectedFilters.rooms.length === 0 || selectedFilters.rooms.includes(i.auctionRoom)
    
                return  categoryMatch && roomMatch
            })
        }
        
    },[items, selectedFilters])

    return(
        <section id="itemGallery">

            {/* side menu to display filters for galllery [wip]*/}
            <div className="filter-side-menu">
              
                <h3>Categories</h3>
                { categories.map((c)=>(
                    <label htmlFor="" key={c}>
                        <input type="checkbox"
                        value={c}
                        checked= {selectedFilters.categories.includes(c)} 
                        onChange={(e) => handleFilterSelection(e, 'categories')}
                        />
                        {c}
                    </label>
                ))}

                <h3>Rooms</h3>
                { rooms.map((r)=>(
                    <label htmlFor="" key={r}>
                        <input type="checkbox"
                        value={r}
                        checked= {selectedFilters.rooms.includes(r)} 
                        onChange={(e) => handleFilterSelection(e, 'rooms')}
                        />
                        {r}
                    </label>
                ))}
            </div>
        
            <div className="item-container">
                {/* Error Message for data */}
                {fetchError && (<p>{fetchError}</p>)}
                {filterItems &&(
                    <div className="item_container_grid">
                        {/* Array of items for Auction */}
                        {filterItems.map( (item: AuctionItem) =>(
                            <ItemCard key={item.itemId} itemData={item} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )  
}