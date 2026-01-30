'use client'

import { Key, useState } from "react"

interface FilterSelection {
    filterType: string,
    subfilter: string[],
    onFilterClick: string[],
}

/* filterType : name of filter , subfilter: a subgroup of that filter criteria, 
** onFilterClick: function that holds an array of values if what is being clicked. 
*/
export default function AccordionFilter ({filterType, subfilter, onFilterClick }:FilterSelection){
   
    const [isActive, setIsActive] = useState(true);

    return(
        <>
            <div className="filter-container">
                {/* display filter type ex: category */}
                <div className="filter-type" key={filterType} onClick={()=>setIsActive(!isActive)}>
                    <p>{filterType}</p>
                    <div>{isActive ? '-' : '+'}</div>
                </div>
                 {/* display filter sub category ex: home deco */}
                {isActive && 
                    <div className="filterBy">
                        {subfilter.map((i:string, index: Key)=>(
                            <div key={index}>
                                <input type="checkbox" id="subcategory" key={index} value={i} onChange={onFilterClick}/>
                                <label htmlFor="subcategory">{i}</label>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </>
    )
}