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

interface Filters {
    categories: string[],
    rooms:string[]
}

/* This page will display a gallery of items that will run in auction */
export default function Items () {

    const [fetchError, setFetchError] = useState<any>(null)
    const [items, setItems] = useState<any>(null)
    /* holds the filters and their values  */
    const [selectedFilters, setSelectedFilters] = useState<Filters>({categories:[], rooms:[]})
    /* will hold unique values to display check boxes for user to click on to filter */
    const [categories, setCategories] = useState<string[]>([])
    const [rooms, setRooms] = useState<string[]>([])

    /* Fetch data from Supbase data base and store in items state */
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

    /* scans input and returns unique values from the data source (supabase db) from a field (column name from db) */
    const getUniqueFilterOptions = (data:[], field:string) => {
        return [...new Set(data.map(i => i[field]))]
       
    }
    /* after scanning db stores only unique values (to avoid repeating checkboxes for display ) */
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
    /* when user clicks on a check box, tracks what is clicked and from which filter type (ex: rooms/categories)*/
    const handleFilterSelection = (e:Event, filterType:string) => {
        const {value, checked} = e.target;

        setSelectedFilters( prevFilters => {
            const currFilters = prevFilters[filterType]
            if(checked){
                /* ex: rooms: [room01, added values here] is added to the current filter type array[]  */
                return {...prevFilters, [filterType]:[...currFilters,value]} 
            }else{
                /* checkboxes not checked - won't display items of that category */
                return{...prevFilters, [filterType]:currFilters.filter(f=>f !=value) }
            }
        })
    }

    /* organizes updated list of items to display based on filter selections */
    const filterItems = useMemo (()=> {
        if(items){
            return items.filter( i => {
                /* category selection either is not selected OR has selections from the group */
                const categoryMatch = selectedFilters.categories.length === 0 ||
                    /* selected categories must be included in displayed items properties */
                    selectedFilters.categories.includes(i.category)
                /* room selection either is not selected OR has selections from the group */
                const roomMatch = selectedFilters.rooms.length === 0 || selectedFilters.rooms.includes(i.auctionRoom)
                /* both category AND room have their selections compared and appplies the AND logic when displaying the result */
                return  categoryMatch && roomMatch
            })
        }
        
    },[items, selectedFilters])

    // console.log(selectedFilters)
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