interface UserData {
    user_id:number;
    profile_url:string;
    email:string;
    description: string;
    location:string;
    first_name:string;
    last_name:string;
    display_name: string;
    gender: string;
    age: number;
    follows:boolean;
    distance_type: string;
    is_me: boolean;
    isMe: boolean;
    location_visibility:boolean;
    about_visibility:boolean;
    email_visibility:boolean;
    email_mailto:string;
    total_distance: number;
    rel_distance: number;
    route_idx: number;
    child_user_stats: any[];
    isTeam: boolean;
}

export {
    UserData,
}