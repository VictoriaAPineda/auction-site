'use client'

import { Key, useState } from "react"

export default function AccordionFilter ({filterName, filters, onFilterClick}){
 
    const [isActive, setIsActive] = useState(true);
    console.log( filters)
    return(
        <>
            <div className="filter-container">
                <div className="filter-type"  onClick={()=>setIsActive(!isActive)}>
                    <p>{filterName}</p>
                    <div>{isActive ? '-' : '+'}</div>
                </div>
               
                {isActive && filters !=undefined &&
                    <div className="filterBy">
                        {filters.map((i, index) => (
                            <div key={index}>
                                 <input type="checkbox" id="subcategory" key={index} value={i} onChange={onFilterClick}/>
                                <label htmlFor="subcategory">{i}</label>
                            </div>
                        ))}


                        
                        {/* {filters.map((i, index)=>(
                            <div key={index}>
                                <input type="checkbox" id="subcategory" key={index} value={i} onChange={onFilterClick}/>
                                <label htmlFor="subcategory">{i}</label>
                            </div>
                        ))} */}

                    </div>
                }
            </div>
        </>
    )
}