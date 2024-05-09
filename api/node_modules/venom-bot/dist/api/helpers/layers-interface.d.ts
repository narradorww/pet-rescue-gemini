export interface Scope {
    erro: boolean;
    to: string;
    text: string;
}
export declare function checkValuesSender(data: any): true | {
    erro: boolean;
    param: any;
    function: any;
    text: string;
};
