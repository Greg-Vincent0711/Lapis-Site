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

export type NodePosition = {
    id: string;
    from: string;
    to: string;
    fromPos: { x: number, y: number};
    toPos: { x: number, y: number};
}

export type ArchitectureItem = {
    icon_img: string;
    popup_text: string;
}