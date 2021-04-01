interface Tag {
    name:string;
    type:number;
    id:number;
}
  
enum TagType {
    ENTRY=1,
    OWNER=2,
}

export {
    Tag,
    TagType,
}

  