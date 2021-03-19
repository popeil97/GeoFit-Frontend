interface CheckpointContent {
    image:any;
    description: string;
}
  
interface Checkpoint {
    marker: number;
    name: string;
    id: number;
    content: CheckpointContent;
}

interface CheckpointMapData {
    marker:number;
    name:string;
    id:number;
    distance_type:string;
  }

export {
    Checkpoint, CheckpointContent, CheckpointMapData
}