import { AuctionItem } from "../items/page"
/* Each Auction Item */
const ItemCard = ({itemData} :{itemData : AuctionItem}) =>{
    return(
        <div>
            {/* Item's details */}
            <p>Category: {itemData.category}</p>
            <p>Starting Bid Price: {itemData.startPrice}</p>
            <p>Condition: {itemData.condition}</p>
            <p>Description: {itemData.description}</p>
            <p>-</p>
        </div>
    )
}
export default ItemCard