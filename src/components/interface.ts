export interface Comment {
    id: string;
    issueID: string;
    projectID: string;
    comment: string;
    createdBy: {
      id: number;
      name: string;
      email: string;
      teamName: string;
      designation: string;
    };
    createdOn: string;
    updatedOn: string | null;
  }
  export interface Issue {
    id: string;
    summary: string;
    type: number;
    projectID: string;
    description: string;
    priority: number;
    assignee: {
      id: number;
      name: string;
      email: string;
      teamName: string;
      desination: string;
    };
    tags: string[];
    sprint: string;
    storyPoint: number;
    status: number;
    createdBy: any;
    createdOn: string;
    updatedBy: {
      id: number;
      name: string;
      email: string;
      teamName: string;
      desination: string;
    };
    updatedOn: string;
  }

  export interface Project {
    projectID: string;
    projectName: string;
    projectStartDate: string;
    projectEndDate: string;
    projectOwner: {
      id: number;
      name: string;
      email: string;
      teamName: string;
      desination: string;
    };
  }