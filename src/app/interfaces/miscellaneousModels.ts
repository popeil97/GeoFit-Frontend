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

interface Progress {
    distance_remaining:number;
    distance:number;
    distance_type:string;
    pace:string;
  }

export {
    Choice, ConfirmationData, Progress
}