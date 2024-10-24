use cw_pid::pid::pid;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

#[wasm_bindgen]
pub fn do_pid(input: JsValue) -> JsValue {
    let output = pid(input);
    serde_wasm_bindgen::to_value(&output).unwrap()
}
