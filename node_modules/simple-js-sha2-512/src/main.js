const max = 2n ** 64n//Math.pow(2n, 32n)
const fast = typeof window === 'undefined'

const k =
    [
        0x428a2f98d728ae22n, 0x7137449123ef65cdn, 0xb5c0fbcfec4d3b2fn, 0xe9b5dba58189dbbcn, 0x3956c25bf348b538n, 
        0x59f111f1b605d019n, 0x923f82a4af194f9bn, 0xab1c5ed5da6d8118n, 0xd807aa98a3030242n, 0x12835b0145706fben, 
        0x243185be4ee4b28cn, 0x550c7dc3d5ffb4e2n, 0x72be5d74f27b896fn, 0x80deb1fe3b1696b1n, 0x9bdc06a725c71235n, 
        0xc19bf174cf692694n, 0xe49b69c19ef14ad2n, 0xefbe4786384f25e3n, 0x0fc19dc68b8cd5b5n, 0x240ca1cc77ac9c65n, 
        0x2de92c6f592b0275n, 0x4a7484aa6ea6e483n, 0x5cb0a9dcbd41fbd4n, 0x76f988da831153b5n, 0x983e5152ee66dfabn, 
        0xa831c66d2db43210n, 0xb00327c898fb213fn, 0xbf597fc7beef0ee4n, 0xc6e00bf33da88fc2n, 0xd5a79147930aa725n, 
        0x06ca6351e003826fn, 0x142929670a0e6e70n, 0x27b70a8546d22ffcn, 0x2e1b21385c26c926n, 0x4d2c6dfc5ac42aedn, 
        0x53380d139d95b3dfn, 0x650a73548baf63den, 0x766a0abb3c77b2a8n, 0x81c2c92e47edaee6n, 0x92722c851482353bn, 
        0xa2bfe8a14cf10364n, 0xa81a664bbc423001n, 0xc24b8b70d0f89791n, 0xc76c51a30654be30n, 0xd192e819d6ef5218n, 
        0xd69906245565a910n, 0xf40e35855771202an, 0x106aa07032bbd1b8n, 0x19a4c116b8d2d0c8n, 0x1e376c085141ab53n, 
        0x2748774cdf8eeb99n, 0x34b0bcb5e19b48a8n, 0x391c0cb3c5c95a63n, 0x4ed8aa4ae3418acbn, 0x5b9cca4f7763e373n, 
        0x682e6ff3d6b2b8a3n, 0x748f82ee5defb2fcn, 0x78a5636f43172f60n, 0x84c87814a1f0ab72n, 0x8cc702081a6439ecn, 
        0x90befffa23631e28n, 0xa4506cebde82bde9n, 0xbef9a3f7b2c67915n, 0xc67178f2e372532bn, 0xca273eceea26619cn, 
        0xd186b8c721c0c207n, 0xeada7dd6cde0eb1en, 0xf57d4f7fee6ed178n, 0x06f067aa72176fban, 0x0a637dc5a2c898a6n, 
        0x113f9804bef90daen, 0x1b710b35131c471bn, 0x28db77f523047d84n, 0x32caab7b40c72493n, 0x3c9ebe0a15c9bebcn, 
        0x431d67c49c100d4cn, 0x4cc5d4becb3e42b6n, 0x597f299cfc657e2an, 0x5fcb6fab3ad6faecn, 0x6c44198c4a475817n
    ]

function rotr(x, n) {
    const b = (x >> (n))
    const c = (x - (x >> (n) << n) << (64n - n))
    return b+c
}

const utf8 = function (str) {
    var i, l = str.length,
      output = new Array(Math.ceil(str.length/64)*16).fill(0n)
    let current = 0n
    for (i = 0; i < l; i += 1) {
        const r = BigInt(i) % 8n
        if (r === 0n) {
            current = 0n
        }
        if (l !== i) {
            current += BigInt(str.charCodeAt(i)) << (7n - r) * 8n
        }
        else {
            current += 128n << +(7n - r) * 8n
        }
        output[BigInt(i)/8n | 0n] = current
    }
    const ln = BigInt(output.length * 8)
    output[Math.floor(i/8)] = output[Math.floor(i/8)] || 0n
    const offset = BigInt((8 - (i + 1)%8)*8)
    const inject = (0x80n << offset)
    output[Math.floor(i/8)] = ((output[Math.floor(i/8)] || 0n) | inject);
    output[output.length - 1] = BigInt(str.length * 8);
    return output
}

module.exports = m => { 
    const H = [0x6a09e667f3bcc908n, 0xbb67ae8584caa73bn, 0x3c6ef372fe94f82bn, 0xa54ff53a5f1d36f1n, 0x510e527fade682d1n, 0x9b05688c2b3e6c1fn, 0x1f83d9abfb41bd6bn, 0x5be0cd19137e2179n]
    
    const utfStartTime = Date.now()
    const M = utf8(m);
    global.utfTime += Date.now() - utfStartTime

    const w = new Array(80)
    var a, b, c, d, e, f, g, h;

    // console.log(M)

    for (var t = 0, len = M.length; t < len; t+=16) {
        if (M[t] === undefined) {
            M[t] = 0
        }
        a = H[0]
        b = H[1]
        c = H[2]
        d = H[3]
        e = H[4]
        f = H[5]
        g = H[6]
        h = H[7]

        for (let i = 0; i < 80; i++) {
            if (i <= 15) {
                w[i] = M[t + i] === undefined ? 0 : M[t + i];
            } else {
                const w15 = w[i-15]
                const w2 = w[i-2]

                const s0 = rotr(w15, 1n) ^ rotr(w15, 8n) ^ (w15 >> 7n)
                const s1 = rotr(w2, 19n) ^ rotr(w2, 61n) ^ (w2 >> 6n)
                w[i] = (w[i-16] + s0 + w[i-7] + s1) % max
            }

            const S1 = rotr(e, 14n) ^ rotr(e, 18n) ^ rotr(e, 41n)
            const ch = (e & f) ^ (~e & g)
            const temp1 = (h + S1 + ch + k[i] + w[i]) % max
            const S0 = rotr(a, 28n) ^ rotr(a, 34n) ^ rotr(a, 39n)
            const maj = (a & b) ^ (a & c) ^ (b & c)
            const temp2 = (S0 + maj) % max
    
            h = g
            g = f
            f = e
            e = (d + temp1) % max
            d = c
            c = b
            b = a
            a = (temp1 + temp2) % max
        }


        H[0] = (H[0] + a) % max
        H[1] = (H[1] + b) % max
        H[2] = (H[2] + c) % max
        H[3] = (H[3] + d) % max
        H[4] = (H[4] + e) % max
        H[5] = (H[5] + f) % max
        H[6] = (H[6] + g) % max
        H[7] = (H[7] + h) % max
    }
    H[0] = (H[0] + max) % max
    H[1] = (H[1] + max) % max
    H[2] = (H[2] + max) % max
    H[3] = (H[3] + max) % max
    H[4] = (H[4] + max) % max
    H[5] = (H[5] + max) % max
    H[6] = (H[6] + max) % max
    H[7] = (H[7] + max) % max
    
    return base16(H)   
}

const base16 = (H) => {
let arr = []

    for (let i = 0; i < 8; i++) {
        const j = i * 8
        const item = H[i]
        arr[j] = (item >> 56n) & 0xffn
        arr[j + 1] = (item >> 48n) & 0xffn
        arr[j + 2] = (item >> 40n) & 0xffn
        arr[j + 3] = (item >> 32n) & 0xffn
        arr[j + 4] = (item >> 24n) & 0xffn
        arr[j + 5] = (item >> 16n) & 0xffn
        arr[j + 6] = (item >> 8n) & 0xffn
        arr[j + 7] = item & 0xffn
    }
    return arr.map(i => i.toString(16).padStart(2, '0')).join('')
}