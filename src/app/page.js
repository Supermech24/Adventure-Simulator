'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import MouseTrail from "@pjsalita/react-mouse-trail";


  

  


export default function Home() {
    const [input, setInput] = useState("");
    const router = useRouter();

    const config = {
        color: "#ffffff",
        idleAnimation: true,
        idleAnimationCount: 10,
        inverted: true,
        size: 20,
        trailCount: 50,
      };

    function textbox_updated(e) {
        setInput(e.target.value);
      }
    function submit_button(e) {
            router.push("/game/" + input);
    }

    return (
        <div id="api-key-getter">
            <MouseTrail {...config} />
            <div id="background-image">
                <Image src="/space.jpg"
                    id = "backimg"
                    width={700}
                    height={700}>
                    
                </Image>
            </div>
            
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