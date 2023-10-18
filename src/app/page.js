'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { OpenAI } from 'openai';
export default function Home() {
    const [input, setInput] = useState("");
    const router = useRouter();

    function textbox_updated(e) {
        setInput(e.target.value);
      }
    /* async function is_api_key_valid() {
    try{
        response = await openai.completions.create(
            engine="davinci",
            prompt="This is a test.",
            max_tokens=5
        );
    }
    catch(error){
        return false;
    }
    finally {
        return true;
    }
    }
    function submit_button(e) {
        OpenAI.api_key = input;
        let api_key_valid = is_api_key_valid();
        if (api_key_valid) {
            router.push("/game/" + input);
        }
    } */
    function submit_button(e) {
            router.push("/game/" + input);
    }
    return (
        <div id="api-key-getter">
        
            
            <div id="title">
                <p>
                    AdventurAI: A Choose Your Own Adventure Game
                </p>
                <p>
                    Created by Edwin Luhnow
                </p>
            </div>
            <div id = "api-key-input">
                <div id="api-key-input-text">
                    <p>
                        Please enter your OpenAI API key here:
                    </p>
                </div>
                <div id="api-key-input-box">
                    <textarea id = "keybox"
                    value={input}
                    onChange={(e) => textbox_updated(e)}/>
                </div>
            </div>
            <div id="submit-button">
                <button id="verify-key" onClick={(e) => submit_button(e)}>
                    Verify Key
                </button>
            </div>

        </div>
    )
}