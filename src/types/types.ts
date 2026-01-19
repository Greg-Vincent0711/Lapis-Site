/**
 * Update this file to have more succint types(combine where possible)
 */
import type { SignUpOutput } from "@aws-amplify/auth";
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
    jwtToken: string | undefined;
    authReady: boolean;
    userSignUp: (name: string, email: string, password: string) => Promise<SignUpOutput>;
    userSignIn: (email: string, password: string) => Promise<void>;
    // gets info from getCurrentUser
    userSignOut: () => Promise<void>;    
  }

// shape of data retrieved from api request
export type Location = {
    id: string;
    location_name: string;
    type: string;
    xCoord: number;
    yCoord: number;
    zCoord: number;
    imageUrl?: string;
  }


  // shape of react component
export type LocationCardProps = {
    id: string;
    location_name: string;
    type: string;
    xCoord: number;
    yCoord: number;
    zCoord: number;
    onEdit: (id: string, updates: Pick<Location, 'location_name' | 'type' | 'xCoord' | 'yCoord' | 'zCoord'>) => void;
    onDelete: (locationId: string) => void;
    imageUrl?: string;
    onImageUpload: (id: string, file: File) => void;
}

export type NewLocationPayload = {
    location_name: string;
    type: string;
    xCoord: number;
    yCoord: number;
    zCoord: number;
  };
  
  export type AddLocationModalProps = {
    shouldShow: boolean;
    toggle: () => void;
    onSubmit: (payload: NewLocationPayload) => void;
  };
  