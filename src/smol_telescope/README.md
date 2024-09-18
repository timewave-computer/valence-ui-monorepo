# Why 'smol'?

The UI only uses a small subset of signing types. However, generating these types requires a large number of dependencies (1000+ lines of protobuf files) and generates a huge number of types.

To avoid bloat, the types are generated in [telescope-valence-ui](https://github.com/timewave-computer/valence-ui-telescope/tree/6f952298c69c80b10bd9eee9ed8ef55cf6112acc) and manually imported and added to the amino and proto registries here.

## How to import a type

1. after running the generate command in the telescope repo, find the generated types for message type URL (for example) `/cosmos.bank.v1beta1.MsgSend` and copy all related types
2. make sure to also copy the class with the same name, i.e.:

```js
export const MsgSend = {
  typeUrl: "/cosmos.bank.v1beta1.MsgSend",
  encode(message: MsgSend, writer: BinaryWriter = BinaryWriter.create()): BinaryWriter {
    if (message.fromAddress !== "") {
      writer.uint32(10).string(message.fromAddress);
    }
  }
  ...
}
```

3. import the class and add to `smol-amino-registry` and `smol-proto-registry`
4. all set! these registries are supplied to the wallet provider.
