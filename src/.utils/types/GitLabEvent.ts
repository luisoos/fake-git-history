export type GitLabEvent = {
    id: number;
    project_id: number;
    action_name: string;
    target_id: number | null;
    target_iid: number | null;
    target_type: string | null;
    author_id: number;
    target_title: string | null;
    created_at: string;
    author: {
      id: number;
      username: string;
      name: string;
      state: string;
      locked: boolean;
      avatar_url: string;
      web_url: string;
    };
    imported: boolean;
    imported_from: string;
    push_data: {
      commit_count: number;
      action: string;
      ref_type: string;
      commit_from: string;
      commit_to: string;
      ref: string;
      commit_title: string;
      ref_count: number | null;
    };
    author_username: string;
};

export type DebloatedGitLabEvent = {
    id: number;
    project_id: number;
    action_name: string;
    target_id: number | null;
    target_iid: number | null;
    target_type: string | null;
    author_id: number;
    target_title: string | null;
    created_at: string;
}