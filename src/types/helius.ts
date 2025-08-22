export interface TokenInfo {
    symbol: string;
    name: string;
    balance: number;
    value: number | null;
    price: number | null;
    image?: string;
}

export interface HeliusAsset {
    id: string;
    content: {
        metadata: {
            name: string;
            symbol: string;
        };
        links?: {
            image?: string;
        }
    };
    token_info?: {
        balance: number;
        decimals: number;
        price_info?: {
            price_per_token: number;
            total_price: number;
        };
    };
    interface: string;
}