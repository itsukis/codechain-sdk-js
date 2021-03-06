import { getTransactionFromJSON } from "../transaction/Transaction";
import { H160 } from "../H160";
import { U256 } from "../U256";
import { H512 } from "../H512";

import { ChangeShardState } from "./ChangeShardState";
import { Payment } from "./Payment";
import { SetRegularKey } from "./SetReulgarKey";
import { CreateShard } from "./CreateShard";

export type Action = ChangeShardState | Payment | SetRegularKey | CreateShard;

export function getActionFromJSON(json: any): Action {
    const { action } = json;
    switch (action) {
        case "changeShardState":
            const { transactions } = json;
            return new ChangeShardState({ transactions: transactions.map(getTransactionFromJSON) });
        case "payment":
            const { receiver, amount } = json;
            return new Payment(new H160(receiver), new U256(amount));
        case "setRegularKey":
            const { key } = json;
            return new SetRegularKey(new H512(key));
        case "createShard":
            return new CreateShard();
        default:
            throw new Error(`Unexpected parcel action: ${action}`);
    }
}
