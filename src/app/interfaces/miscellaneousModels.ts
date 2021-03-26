interface Choice {
    text:string;
    value:any;
    buttonColor:string;
    textColor:string;
}

interface ConfirmationData {
    header:string;
    prompt:string;
    choices:Array<Choice>;
}

export {
    Choice, ConfirmationData,
}