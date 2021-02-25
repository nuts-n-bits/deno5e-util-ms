use crypto::digest::Digest;
use crypto::sha3::Sha3;
use crypto::sha2::Sha256;
use crypto::sha1::Sha1;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn sha3_256(input: &[u8]) -> std::vec::Vec<u8> {
    // create a SHA3-256 object
    let mut hasher = Sha3::sha3_256();

    // write input message
    hasher.input(input);

    // read hash digest
    let out: &mut [u8] = &mut [0; 32];
    hasher.result(out);
    (*out).to_vec()
}

#[wasm_bindgen]
pub fn sha3_512(input: &[u8]) -> std::vec::Vec<u8> {
    // create a SHA3-256 object
    let mut hasher = Sha3::sha3_512();

    // write input message
    hasher.input(input);

    // read hash digest
    let out: &mut [u8] = &mut [0; 64];
    hasher.result(out);
    (*out).to_vec()
}

#[wasm_bindgen]
pub fn sha2_256(input: &[u8]) -> std::vec::Vec<u8> {
    // create a SHA3-256 object
    let mut hasher = Sha256::new();

    // write input message
    hasher.input(input);

    // read hash digest
    let out: &mut [u8] = &mut [0; 32];
    hasher.result(out);
    (*out).to_vec()
}

#[wasm_bindgen]
pub fn sha1_160(input: &[u8]) -> std::vec::Vec<u8> {
    // create a SHA3-256 object
    let mut hasher = Sha1::new();

    // write input message
    hasher.input(input);

    // read hash digest
    let out: &mut [u8] = &mut [0; 20];
    hasher.result(out);
    (*out).to_vec()
}

mod test {

    use super::*;

    #[test]
    fn test() {
        assert_eq!(hex::encode(sha1_160("abc".as_bytes())), "a9993e364706816aba3e25717850c26c9cd0d89d");
        assert_eq!(hex::encode(sha2_256("abc".as_bytes())), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
        assert_eq!(hex::encode(sha3_256("abc".as_bytes())), "3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532");
        assert_eq!(hex::encode(sha3_512("abc".as_bytes())), "b751850b1a57168a5693cd924b6b096e08f621827444f70d884f5d0240d2712e10e116e9192af3c91a7ec57647e3934057340b4cf408d5a56592f8274eec53f0")
    }
}