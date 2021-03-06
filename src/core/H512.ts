const RLP = require("rlp");
/**
 * Handles 512-bit data. Used to express public keys.
 */
export class H512 {
    value: string;

    constructor(value: string) {
        if ((!value.startsWith("0x") && value.length !== 128) || (value.startsWith("0x") && value.length !== 130)) {
            throw `The length for H512 must be 128 or 130 with 0x-prefix`;
        } else if (!/(0x)?[0-9a-fA-F]{128}/.test(value)) {
            throw `Invalid hexadecimal string: ${value}`;
        }
        this.value = value.startsWith("0x") ? value.slice(2).toLowerCase() : value.toLowerCase();
    }

    static fromBytes(buffer: Buffer): H512 {
        const bytes = Array.from(buffer.values());
        const firstByte = bytes.shift();
        const length = bytes.shift();
        if (firstByte !== 0xb8 || length !== 64 || bytes.length !== length) {
            throw `Invalid RLP for H512: ${bytes}`;
        }
        return new H512(bytes.map(byte => byte < 0x10 ? `0${byte.toString(16)}` : byte.toString(16)).join(""));
    }

    static ensure(param: H512 | string): H512 {
        return param instanceof H512 ? param : new H512(param);
    }

    toEncodeObject(): string {
        return `0x${this.value}`;
    }

    rlpBytes(): Buffer {
        return RLP.encode(this.toEncodeObject());
    }
}
