import type { SignInOutput, SignUpOutput } from "@aws-amplify/auth";
export type ArchitectureNode = {
    id: string;
    title: string;
    type: string;
    position : { x: number, y: number}
    description: string;
    connections: string[];
    color: string;
    icon: string
}
export type ArchitectureDataType = {
    id: string;
    label: string;
    data: {
        icon_img: string;
        popup_text: string
    }
}

export type NodePosition = {
    id: string;
    from: string;
    to: string;
    fromPos: { x: number, y: number};
    toPos: { x: number, y: number};
}

export type ArchitectureItemType = {
    icon_img: string;
    details: string;
    isClicked: boolean;
    onClick: (event: React.MouseEvent) => void;
}

export type User = {
    username: string;
    userId: string;
    name?: string;
}

export type AuthContextType = {
    // in between state
    isLoading: boolean;
    // user information that other components need
    // currentUser infers isSignedIn too
    currentUser: User | null;
    userSignUp: (name: string, email: string, password: string) => Promise<SignUpOutput>;
    userSignIn: (email: string, password: string) => Promise<void>;
    // gets info from getCurrentUser
    userSignOut: () => Promise<void>;    
  }