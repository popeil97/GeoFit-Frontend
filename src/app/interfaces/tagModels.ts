interface Tag {
    name:string;
    type:number;
    id:number;
}
  
enum TagType {
    ENTRY=1,
    OWNER=2,
}

interface TagFormObj {
    name:string,
    type:number,
}

export {
    Tag,
    TagType,
    TagFormObj,
}

  