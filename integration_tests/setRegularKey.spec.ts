import { SDK } from "../";
const U256 = SDK.Core.classes.U256;

const SERVER_URL = process.env.CODECHAIN_RPC_HTTP || "http://localhost:8080";
const sdk = new SDK({ server: SERVER_URL });
const masterSecret = "ede1d4ccb4ec9a8bbbae9a13db3f4a7b56ea04189be86ac3a6a439d9a0a1addd";
const masterAddress = SDK.util.getAccountIdFromPrivate(masterSecret);

const regularSecret = SDK.util.generatePrivateKey();
const regularPublic = SDK.util.getPublicFromPrivate(regularSecret);

test("setRegularKey", async () => {
    const nonce = await sdk.rpc.chain.getNonce(masterAddress);
    const p = sdk.core.createSetRegularKeyParcel({
        key: regularPublic,
    });
    const hash = await sdk.rpc.chain.sendSignedParcel(p.sign({
        secret: masterSecret,
        nonce,
        fee: 10
    }));
    expect(hash).toMatchObject({
        value: expect.stringMatching(/[0-9a-f]{32}/)
    });

    const beforeBalance = await sdk.rpc.chain.getBalance(masterAddress);

    const nonce2 = await sdk.rpc.chain.getNonce(masterAddress);
    const p2 = sdk.core.createPaymentParcel({
        recipient: masterAddress,
        amount: 10,
    });
    await sdk.rpc.chain.sendSignedParcel(p2.sign({
        secret: regularSecret,
        nonce: nonce2,
        fee: 10
    }));
    const afterBalance = await sdk.rpc.chain.getBalance(masterAddress);
    expect(afterBalance.toString()).toEqual(new U256(beforeBalance.value.minus(10)).toString());
});
