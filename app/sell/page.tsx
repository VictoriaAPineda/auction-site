'use client'

import { ChangeEvent, useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import {redirect, useParams, useSearchParams} from 'next/navigation'


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

    const [formData, setFormData] = useState({
        itemName: '',
        description: '',
        condition: '',
        category: 'House Deco',
        certified: false,
        startPrice: '',
        image: File || null,
    })

    const conditionArray: Array<string> = ['New', 'Excellent', 'Very Good', 'Fair', 'Poor']

    /* Read in item id from url when sent from edit button 
    or document? */
    let params = new URLSearchParams(window.location.search);
    let itemIdForEdit = params.get('id');

    const {id} = useParams()
    useEffect(()=>{
        async function fetchItem() {
            if(itemIdForEdit){
                const { data, error} =  await supabase
                .from('auction_Items')
                .select()
                .eq('itemId', itemIdForEdit)
                .single()
                /* fill if the item id is found in database (acts as a edit form) */
                if(data){
                    setFormData(data)
                }
            }
            else{
                /* If not, form is empty (acts as a add form) */
                setFormData({
                    itemName: '',
                    description: '',
                    condition: '',
                    category: 'House Deco',
                    certified: false,
                    startPrice: '',
                    image: File || null,
                })
            }
        }
        fetchItem()
    },[itemIdForEdit, id])
    
    {/* TODO:Add Regex ? , RLS, redirect later...*/}

    const handleImageFileChange = (e:ChangeEvent<HTMLInputElement>)=>{
        if(e.target.files && e.target.files.length > 0){
           setFormData({...formData, image: e.target.files[0]})
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
        let {value} = e.target;
        setFormData({...formData, category: value})
    }
   
    const handleCeritify = (e:any) =>{
        let {name, value} = e.target;
        // Convert to a boolean
        value = JSON.parse(e.target.value)
        setFormData( {...formData, certified: value})
    }

    const handleSubmit = async(e:any)=>{
        e.preventDefault()
        {/* user id to store the item under */}
        const uid = await getUserid()

        let imgUrl:string | null = null
        if (formData.image) {
            imgUrl = await uploadImg(formData.image)            
        }
        {/* Note:  variables before (...) get overwritten, place new upadted
        variables AFTER otherwise get {} for image */}
        const {data, error} = await supabase
            .from('auction_Items')
            .upsert({
                user_id: uid,
                ...formData,
                image: imgUrl,
             })
            .select()
            .single()

        if(error){
            console.log("Error" + error.message)
        }
        if(data){
            setFormData({
                itemName: '',
                description: '',
                condition: '',
                category: 'House Deco',
                certified: false,
                startPrice: '',
                image: File || null,
            })
            redirect('/items')
        }
    }

    return(
        <section id="sell_container">
            <p>Here Users can fill out form to sell items</p>

            <form action="" className="auction_seller_form" onSubmit={handleSubmit}>
                { itemIdForEdit && <p>Edit Page</p>}
                <h1> Auction Item Form</h1>
                {/* Name */}
                <label htmlFor="itemName">Item Name</label>
                <input type="text" id="itemName" value={formData.itemName} onChange={(e)=> setFormData({...formData, itemName: e.target.value})} required/>

                {/* Description */}
                <label htmlFor="itemDescription">Item Description: </label>
                <input type="text" id="itemDescription" value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} required/>

                {/* Item condition */}
                <fieldset className="conditionField">
                    <legend>Select the item's condition</legend>
                        <div className="conditionContainer">
                            {conditionArray.map((c:string)=>(
                                <div key={c}>
                                    <input type="radio" id={c} name="condition" 
                                    value={c}
                                    checked = {formData.condition === c}
                                    onChange={(e)=>{setFormData({...formData, condition: e.target.value})}} 
                                    required/>
                                    <label htmlFor={c}>{c}</label>
                                </div>
                            ))}
                        </div>
                </fieldset>

                {/* category */}
                <label htmlFor="itemCategory">Choose a category:</label>
                <select name="itemCategory" id="itemCategory" value={formData.category} onChange={handleCategory} required>
                    {/* TODO: Read in the categories from json file instead...*/}
                    <option value="House Deco">House Deco</option>
                    <option value="cat. 2">Cat. 2</option>
                    <option value="cat. 3">Cat. 3</option>
                </select>

                {/* Cerified */}
                <label htmlFor="itemCert">Certified:</label>
                <select name="itemCert" id="itemCert" onChange={handleCeritify} value={formData.certified} required>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>

                {/* TOOD: Add a file input for a ceritification proof */}
                {/* Base Price / Start Bid */}
                <label htmlFor="itemPrice">Base Price: $</label>
                <input type="number"id="itemPrice" value={formData.startPrice} step={0.01} onChange={(e)=>setFormData({...formData, startPrice: Number(e.target.value)})} required />

                {/* upload image */}
                <p>(Please Reupload Image)</p>
                <input type="file" accept="image/*" onChange={handleImageFileChange} required />
               {/* Submit button */}
                <button type="submit"> Submit</button>
            </form>
        </section>
    )
}