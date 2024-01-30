import {ReactNode} from "react";

export type BaseModel = {
    "id": string,
    "created_at": string,
    "updated_at": string,
    "created_by": string
    "updated_by": string
}

export type Children = {
    children: ReactNode
}
