interface Payment {
    paid:number;
    currency:string;
    race_id:number;
    payment_id:string,
    status:string;
    payment_type:PaymentType;
}
  
enum PaymentType {
    ENTRY=1,
    SWAG=2,
    DONATION=3,
}

export {
    Payment,
    PaymentType,
}