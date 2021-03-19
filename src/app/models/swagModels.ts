
interface Item {
    name:string,
    id:number,
    image:string,
    description:string,
    price:number,
    state:ItemState,
    type:ItemType,
    sizes:any[],
}
  
interface Order {
    id:number;
    item:Item;
    details:string;
    payment_id:number;
    race_id:number;
    shipping_id:number;
}
  
interface Cart {
    orders:Order[],
    price:number,
    id:number
}
  
enum ItemState {
    ACTIVE=1,
    INACTIVE=2
}
  
enum ItemType {
    ENTRY=1,
    SWAG=2,
    ENTRYANDSWAG=3
}
  
export {
    Item,
    Order,
    Cart,
    ItemState,
    ItemType,
}