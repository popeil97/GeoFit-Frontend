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

  export {
      Story,
  }