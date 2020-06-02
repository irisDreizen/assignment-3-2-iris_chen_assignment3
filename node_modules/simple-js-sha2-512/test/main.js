const tests = {
    abc:
    'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
   'abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu':
    '8e959b75dae313da8cf4f72814fc143f8f7779c6eb9f7fa17299aeadb6889018501d289e4900f7e4331b99dec4b5433ac7d329eeb6dd26545e96e55b874be909',
    '1abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu':
    '4afb077f8f88427ea6e17c1a6d65dcd25e9f2947f3281a03a3d578b9a1495dcebbe276bbc3c49bf80c5cb24748332feb1eeae538758175f0d7a32efaa907b771'
}

const sha2_512 = require('../src/main.js')
for (const input of Object.keys(tests)) {
    const output = tests[input]
    if (sha2_512(input) !== tests[input]) {
        throw `input failed ${input} ${sha2_512(input)} should be ${output}`
    }
}