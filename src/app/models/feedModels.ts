interface Story {
    user_id: number;
    username: string;
    display_name: string;
    profile_url: string;
    story_id: number;
    story_text: string;
    story_image: string;
    created_ts: number;
    report_count: number;
}

interface Comment {
    username: string;
    display_name:string;
    profile_url:string;
    message:string;
    body:string;
    created_ts:number;
}


interface FeedObj {
    user_id: number;
    display_name: string;
    username: string;
    profile_url:string
    joined: boolean;
    traveled: boolean;
    likes: boolean;
    likes_count: number;
    story: boolean;
    story_image:string;
    story_text:string;
    story_id:number;
    total_distance:number;
    last_distance:number;
    message: string;
    created_ts:number;
    is_mine:boolean;
    comments: Comment[];
    show_comments: boolean;
    follows: boolean;
  }

export {
    Story,
    Comment,
    FeedObj,
}