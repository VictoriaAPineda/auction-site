'use client'
import Link from "next/link"
import supabase from "../config/supabaseClient"
import { useState } from "react";

export default function Navbar(){


    const [loggedin, setisLoggedIn] = useState(false);

    // const {data, error} = async() => {
    //     supabase.auth.getUser();
    // }
    // if(user){
    //     setisLoggedIn(true)
    //     console.log(user.email)
    // }else{
    //     console.log("no current user")
    // }

    return(
        <section>
            <nav className="menuNav">
                <Link href="/"><li>[Home Logo Here]</li></Link>
                <div className="menuRight">
                    <Link href="/items"><li>Auction Gallery</li></Link>
                    <Link href="/sell"><li>Sell</li></Link>
                    {/* Toggle login / logout*/}
                    <Link href="/login"><li className="logBtn">{loggedin ? "Logout" :"Login"}</li></Link> 
                </div>
            </nav>
        </section>
    )
}