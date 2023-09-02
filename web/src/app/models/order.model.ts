import { Item } from "./item.model";
import { Status } from "./status.model";

export interface Order {
    orderId: number;
    serverId: number,
    tableNum: number,
    orderDate: string,
    orderTotal: number,
    state: Status,
    instructions: string,
    items: Item[],
    username: string
}