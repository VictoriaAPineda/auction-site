import Image from "next/image"
import { AuctionItem } from "../items/page"
import itemImage from "../assets/antique_img.jpg"

/* Each Auction Item */
const ItemCard = ({itemData} :{itemData : AuctionItem}) =>{
    return(
        <div className="itemCard">
            <Image src={itemImage } alt="" width={150} loading="eager" className="itemImage" />
            {/* Item's details */}
            <div className="itemText">
                <p className="itemTtle">{itemData.itemName}</p>
                <p className="itemStartBid">Starting Bid: {itemData.startPrice}</p>
            </div>
            <div className="itemNavBtns">
                <button>View Details</button>
                <button>Bid</button>
            </div>
        </div>
    )
}
export default ItemCard