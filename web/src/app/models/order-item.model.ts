import { Status } from "./status.model";

export interface OrderItem {
    status: Status,
    quantity: number,
    qualifiers: string,
    orderId: number,
    itemId: number
}