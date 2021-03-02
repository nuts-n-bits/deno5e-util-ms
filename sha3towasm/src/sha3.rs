use crypto::digest::Digest;
use crypto::sha3::Sha3;
use crypto::sha2::Sha256;
use crypto::sha1::Sha1;
use wasm_bindgen::prelude::*;
use std::collections::HashMap;
use std::cell::RefCell;

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
pub struct ChunkedResult {
    result: Option<std::vec::Vec<u8>>,
    continue_with: Option<i32>,
    error: bool,
}

std::thread_local! {
    static HASHMAP: RefCell<HashMap<i32, Sha3>> = RefCell::new(HashMap::default());
    static ctr: RefCell<i32> = RefCell::new(0);
}

#[wasm_bindgen]
pub fn sha3_256_chunked(chunked_input: &[u8], use_existing: Option<i32>, close_and_output: bool) -> ChunkedResult {

    // create a SHA3-256 object
    let hasher: Sha3;
    
    match use_existing {
        None => { 
            hasher = Sha3::sha3_256();
            ctr.with(|c| {
                HASHMAP.with(|hm| hm.borrow_mut().insert(*c.borrow(), hasher));
                use_existing = Some(*c.borrow());
                c.set()
            });
        } 
        Some(id) => { 
            let try_cache = HASHMAP.with(|hm| hm.borrow_mut().get_mut(&ctr));

            match try_cache {
                None => {
                    return ChunkedResult { result: None, continue_with: None, error: true };
                }
                Some(&mut sha3) => {
                    sha3.input(chunked_input);
                }
            }
        }
    }

    if chunked_input.len() > 0 {
        hasher.input(chunked_input);
    }

    if close_and_output {
        // read hash digest
        let out: &mut [u8] = &mut [0; 32];
        hasher.result(out);
        match use_existing {
            None => {}
            Some(id) => { HASHMAP.with(|hm| hm.borrow_mut().remove(&id)); }
        }
        return ChunkedResult { result: Some((*out).to_vec()), continue_with: None, error: false };
    }
    else {
        return ChunkedResult { result: None, continue_with: use_existing, error: false };
    }
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
