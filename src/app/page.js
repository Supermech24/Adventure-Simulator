'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import Image from 'next/image'
export default function Home() {
    const [input, setInput] = useState("");
    const router = useRouter();

    function textbox_updated(e) {
        setInput(e.target.value);
      }

    function submit_button(e) {
        router.push("/game/" + input);
    }
    return (
        <div id="api-key-getter">
        
            <Image src="/Adventure.webp"
          width={1800}
          height={2500}
          id ="background-image"/>
            <div id="title">
                <p>
                    Choose Your Own Adventure: An AI Game
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