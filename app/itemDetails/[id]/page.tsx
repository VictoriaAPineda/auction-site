// 'use client'

async function getItemDetails(id:any) {
    const res = await fetch('http://localhost:3000/itemDetails/' + id,{
        next:{
            revalidate: 60
        }
    })
    return res.json()
}
// {params}:{params:{id:any}}
export default async function ItemDetails ({params}:any) {
    // const {item} = await getItemDetails(params.id);
    
    try {
        // const {id} = await getItemDetails(params.id);
        // console.log(id)
        // const item = await params.id
        // console.log(item)
    } catch (error) {
        // console.error(error)
    }

    return(
        <section id="itemDetailsPage">
            <h1>Items Page</h1>
            {/* <p>{item}</p> */}
        </section>
    )
}