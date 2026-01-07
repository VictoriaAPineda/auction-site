'use client'
import Image from "next/image"
import { AuctionItem } from "../items/page"
import Link from "next/link"


/* Each Auction Item */
const ItemCard = ({itemData} :{itemData : AuctionItem}) =>{
    return(
        <div className="itemCard">
            <Image src={itemData.image} alt="" width={150} height={150} loading="eager" className="itemImage" />
            {/* Item's details */}
            <div className="itemText">
                <p className="itemTtle">{itemData.itemName}</p>
                <p className="itemStartBid">Starting Bid: {itemData.startPrice}</p>
            </div>
            <div className="itemNavBtns">
                <Link href={`/itemDetails/${itemData.id}`}><button>View Details</button></Link>
                <Link href="3"><button>Bid</button></Link>
            </div>
        </div>
    )
}
export default ItemCard