import { OrderItem } from "./order-item.model";

export interface Item {
    itemId: number,
    title: string,
    categoryId: number,
    price: number,
    isAvailable: boolean,
    ingredients: string,
    orderitems: OrderItem
}