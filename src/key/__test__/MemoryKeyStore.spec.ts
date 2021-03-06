import { MemoryKeyStore } from "../MemoryKeyStore";
import { verifyEcdsa, recoverEcdsa } from "../../utils";

test("createKey", async () => {
    const store = new MemoryKeyStore();
    expect(() => {
        store.createKey();
    }).not.toThrow();
});

test("removeKey", async () => {
    const store = new MemoryKeyStore();
    const key1 = await store.createKey();
    expect(await store.removeKey({ publicKey: key1 })).toBe(true);
    expect(await store.removeKey({ publicKey: key1 })).toBe(false);
});

test("getKeyList", async () => {
    const store = new MemoryKeyStore();
    const key1 = await store.createKey();
    const key2 = await store.createKey();
    expect(await store.getKeyList()).toContain(key1);
    expect(await store.getKeyList()).toContain(key2);

    await store.removeKey({ publicKey: key1 });

    expect(await store.getKeyList()).not.toContain(key1);
});

test("sign", async () => {
    const store = new MemoryKeyStore();
    const key1 = await store.createKey();
    const signature = await store.sign({ publicKey: key1, message: "hello" });
    const r = `${signature.substr(0, 64)}`;
    const s = `${signature.substr(64, 64)}`;
    const v = Number.parseInt(signature.substr(128, 2), 16);

    expect(verifyEcdsa("hello", { r, s, v }, key1)).toBe(true);
    expect(recoverEcdsa("hello", { r, s, v })).toEqual(key1);
});
