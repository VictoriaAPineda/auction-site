'use client'

import { ChangeEvent, useState } from "react"
import supabase from "../config/supabaseClient"
import {redirect} from 'next/navigation'

async function getUserid() {
    const {data : {user}, error} = await supabase.auth.getUser()
    if(user){
        const userID = user.id
        return userID
    }
    if(error || !user){
        console.log(error?.message)
        return null
    }
}

export default function Sell(){
    const [itemName, setItemName] = useState('')
    const [itemPrice, setItemPrice] = useState<number|string>('')
    const [itemDescription, setItemDescription] = useState('')
    const [condition, setCondition] = useState('')
    const [itemImage, setItemImage] = useState<File | null>(null)
    const [category, setCategory] = useState('House Deco')
    const [certified, setCertified] = useState<boolean>(false)

    const conditionArray: Array<string> = ['New', 'Excellent', 'Very Good', 'Fair', 'Poor'] 

    {/* TODO:A  Addd Regex , RLS, redirect later...*/}

    const handleImageFileChange = (e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.files.length > 0){
            setItemImage(e.target.files[0])
        }
    }

    const uploadImg = async(file:File): Promise<string | null> =>{
        const filePath = `${file.name}-${Date.now()}`;
        const {error} = await supabase.storage
            .from('item-image')
            .upload(filePath, file)
            
        if (error) {
            console.error('ERROR in uploading img: ', error.message);
            return null;
        }
        const {data} = await supabase.storage
            .from('item-image') 
            .getPublicUrl(filePath)
        
        return data.publicUrl;
    };
    const handleCategory = (e:any) => {
        setCategory(e.target.value)
    }
    const handleCeritify = (e:any) =>{
        // Convert to a boolean
        const val = JSON.parse(e.target.value)
        setCertified(val)
    }

    const handleSubmit = async(e:any)=>{
        e.preventDefault()
        const uid = await getUserid()

        let imgUrl:string | null = null
        if (itemImage) {
            imgUrl = await uploadImg(itemImage)
        }
        
        const {data, error} = await supabase
            .from('auction_Items')
            .insert({itemName, condition, category, certified, startPrice:itemPrice, image:imgUrl, description:itemDescription, userId: uid })
            .select()
            .single()

        if(error){
            console.log("Error" + error.message)
        }
        if(data){
            console.log(data)
            redirect('/items')
        }
    }

    return(
        <section id="sell_container">
            <p>Here Users can fill out form to sell items</p>

            <form action="" className="auction_seller_form" onSubmit={handleSubmit}>
                <h1> Auction Item Form</h1>
                {/* Name */}
                <label htmlFor="itemName">Item Name</label>
                <input type="text" id="itemName" value={itemName} onChange={(e)=>{setItemName(e.target.value)}} required/>

                {/* Description */}
                <label htmlFor="itemDescription">Item Description: </label>
                <input type="text" id="itemDescription" value={itemDescription} onChange={(e)=>{setItemDescription(e.target.value)}} required/>

                {/* Item condition */}
                <fieldset className="conditionField">
                    <legend>Select the item's condition</legend>
                        <div className="conditionContainer">
                            {conditionArray.map((c:string)=>(
                                <div key={c}>
                                    <input type="radio" id={c} name="condition" value={c} onChange={(e)=>{setCondition(e.target.value)}} required/>
                                    <label htmlFor={c}>{c}</label>
                                </div>
                            ))}
                        </div>
                </fieldset>

                {/* category */}
                <label htmlFor="itemCategory">Choose a category:</label>
                <select name="itemCategory" id="itemCategory" value={category} onChange={handleCategory}>
                    <option value="House Deco">House Deco</option>
                    <option value="cat. 2">Cat. 2</option>
                    <option value="cat. 3">Cat. 3</option>
                </select>

                {/* Cerified */}
                <label htmlFor="itemCert">Certified:</label>
                <select name="itemCert" id="itemCert" onChange={handleCeritify}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>

                {/* TOOD: Add a file input for a ceritification proof */}
                {/* Base Price / Start Bid */}
                <label htmlFor="itemPrice">Base Price: $</label>
                <input type="number"id="itemPrice" value={itemPrice} step={0.01} onChange={(e)=>{setItemPrice(Number(e.target.value))}} />

                {/* upload image */}
                <input type="file" accept="image/*" onChange={handleImageFileChange} />
               {/* Submit button */}
                <button type="submit"> Submit</button>
            </form>
        </section>
    )
}