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
    onClick: () => void;
}