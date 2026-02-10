'use client'

import { useState } from "react"

export default function GalleryFilter (){

    const filters = [  
        {"category": [
            "category 01", 
            "category 02", 
            "category 03"
        ]},{"auctionRoom": [
            "room 01", 
            "room 02",
            "room 03"
        ]},
     ]

    return(
        <div>
            <p>Category</p>
           

            
            {/* {filters.map((f, index)=>(
                <div key={index}>
                    <input type="checkbox" id="filter" key={index} value={f.category} />
                    <label htmlFor="subcategory">{f.category}</label>
                </div>
            ))}
            <p>Room</p>
            {filters.map((f, index)=>(
                <div key={index}>
                    <input type="checkbox" id="filter" key={index} value={f.auctionRoom} />
                    <label htmlFor="subcategory">{f.auctionRoom}</label>
                </div>
            ))} */}
        </div>
    )
}