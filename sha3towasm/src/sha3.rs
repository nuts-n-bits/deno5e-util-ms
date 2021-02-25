use crypto::digest::Digest;
use crypto::sha3::Sha3;
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

mod test {

    use super::sha3_256;

    #[test]
    fn test() {
        assert_eq!(hex::encode(sha3_256("abc".as_bytes())), "3a985da74fe225b2045c172d6bd390bd855f086e3e9d525b46bfe24511431532");
    }
}