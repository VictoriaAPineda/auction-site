'use client'
import { useEffect, useState } from "react";
import Auth from "../components/auth";
import supabase from "../config/supabaseClient";

export default function Login () {
    // remove page and just redirect the nav bar to auth instead???
    return(
        <>
            {/* User needs to sign in*/}
            <Auth />
        </>
    )  
}