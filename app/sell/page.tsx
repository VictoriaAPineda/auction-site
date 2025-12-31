'use client'

import { useState } from "react"

export default function Sell(){
    const [itemName, setItemName] = useState('')
    const [condition, setCondition] = useState('')

    const conditionArray: Array<string> = ['New', 'Excellent', 'Very Good', 'Fair', 'Poor'] 

    return(
        <section id="sell_container">
            <p>Here Users can fill out form to sell items</p>

            <form action="">
                {/* Name */}
                <label htmlFor="itemName">Item Name</label>
                <input type="text" id="itemName" value={itemName} onChange={(e)=>{setItemName(e.target.value)}}/>

                {/* Item condition */}
                <fieldset className="conditionField">
                    <legend>Select the item's condition</legend>
                        <div className="conditionContainer">
                            {conditionArray.map((c:string)=>(
                                <div key={c}>
                                    <input type="radio" id={c} name="condition" value={c} onChange={(e)=>{setCondition(e.target.value)}}/>
                                    <label htmlFor="c">{c}</label>
                                </div>
                            ))}
                        </div>
                </fieldset>
            </form>

        </section>
    )
}