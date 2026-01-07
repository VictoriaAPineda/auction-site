'use client'
import { useEffect, useState } from "react";
import Auth from "../components/auth";
import supabase from "../config/supabaseClient";

export default function Login () {

    return(
        <>
            {/* User needs to sign in*/}
            <Auth />
        </>
    )  
}