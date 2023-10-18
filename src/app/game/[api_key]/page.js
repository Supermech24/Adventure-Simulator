/**
 * todo:
 * 1. on title page mention that the API key needs both Dall-e and chatbot access
 * 2. Make sure API key is valid before accepting
 * 3. Make choices look more like buttons
 * 4. makes a spin loader for the choices as well
 * 5. pick final colors for page
 * 6. think of ideas for next project
 */
'use client';
import Image from 'next/image'
import { OpenAI } from 'openai';
import { useState } from 'react';
import { GuardSpinner } from "react-spinners-kit";

let list = [];

export default function Home({ params }) {
  const openai = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: params.api_key,
  });
  
  async function genImage(userPrompt) {
    let img_response = await openai.images.generate({
      prompt: String(userPrompt),
      size: "1024x1024"
    });
    let image_url = img_response.data
    //console.log(image_url[0]["url"]);
    return image_url[0]["url"];
  }
  function changeList(add) {
    list.push(add);
  }
  async function startup_text(five_words) {
    let response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: "Generate the setup of the start of a story about an adventure using this setting: " + five_words,
      temperature: 0,
      max_tokens: 500
    });
    let context = response["choices"][0]["text"];
    changeList({"role": "system", "content": "You are a terminal game with the following story: " + context + ". Every time I respond with an action, generate the next chapter in the story"})
    //console.log(context);
    return context;
  }

  async function startup_image(five_words) {
    let response = await openai.completions.create({
      model: "text-davinci-003",
      prompt: "Generate a short image prompt for DALL-E about a story centering around this story setting:" + five_words,
      temperature: 0,
      max_tokens: 500
    })
    //console.log(response["choices"][0]["text"]);
    return genImage(response["choices"][0]["text"]);
    
  }
  
  async function gameLoopChoices() {
    changeList({"role": "user", "content": "Generate 3 brief, one sentence choices for what can possibly happen next in the story"});
    let AI_response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: list
    })
    changeList({"role": "assistant", "content": AI_response["choices"][0]["message"]["content"]})
    return AI_response["choices"][0]["message"]["content"];
    
  }
  async function gameLoopText(choice) {
    let user_response = choice;
    changeList({"role": "user", "content": "Progress the story with the following choice: Option " + user_response})
    let AI_response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: list
    })
    changeList({"role": "assistant", "content": AI_response["choices"][0]["message"]["content"]});
    return AI_response["choices"][0]["message"]["content"];
  
  }
  async function gameLoopImage() {
    let temp_list = [...list];
    temp_list.push({"role": "user", "content": "Generate a one-sentence image generator prompt based on the most recent events of the story"})
    let image_prompt = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: temp_list
    })
    return genImage(image_prompt["choices"][0]["message"]["content"]);
    
  }

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [counter, setCounter] = useState(0);
  const [image, setImage] = useState("/Adventure.webp");
  const [choice1, setChoice1] = useState("choice 1");
  const [choice2, setChoice2] = useState("choice 2");
  const [choice3, setChoice3] = useState("choice 3");
  const [loading, setLoading] = useState(false);

  function choice1_button(e) {
    choice_button_clicked(1);
  }
  function choice2_button(e) {
    choice_button_clicked(2);
  }
  function choice3_button(e) {
    choice_button_clicked(3);
  }
  function choice_button_clicked(choice) {
    setLoading(true);
    gameLoopText(choice).then (res1 => {
      gameLoopImage().then(res => {
        gameLoopChoices().then(choices => {
          let index1 = choices.indexOf("1");
          let index2 = choices.indexOf("2");
          let index3 = choices.indexOf("3");
          setChoice1(choices.substring(index1, index2));
          setChoice2(choices.substring(index2, index3));
          setChoice3(choices.substring(index3));
          setImage(res);
          setOutput(res1);
          setLoading(false);
      })
      })
    })
  }
  function submit_button(e) {
    setLoading(true);
    console.log(counter);
    if (counter == 0) {
      startup_text(input).then (story => {
        startup_image(input).then(img => {
          gameLoopChoices().then(choices => {
            let index1 = choices.indexOf("1");
            let index2 = choices.indexOf("2");
            let index3 = choices.indexOf("3");
            setChoice1(choices.substring(index1, index2));
            setChoice2(choices.substring(index2, index3));
            setChoice3(choices.substring(index3));
            setOutput(story);
            setImage(img);
            setLoading(false);
          })
          
        })
      })
    }
    setCounter(counter+1);
  }
  
  function textbox_updated(e) {
    setInput(e.target.value);
  }
  
  return (
    
    <div id="display">

      <div id="left_side">
      {loading==true ? (
        <div id="spinner">
        <GuardSpinner size={50} color="#4CB5AE" loading={true}/>
        </div>
      ) : (
        <div id="photo">
        <Image src={image}
          width={700}
          height={700}
          alt="A picture of an adventure"
          id="img"
        />
        <br></br>
        </div>
      )}
      

      {counter>0 ? (
      <div id = "choices">
        <div id="choice-1-box">
          <button id="choice-1-text" onClick={(e) => choice1_button(e)}>{choice1}</button>
        </div>
        <div id="choice-2-box">
          <button id="choice-2-text" onClick={(e) => choice2_button(e)}>{choice2}</button>
        </div>
        <div id="choice-3-box">
          <button id="choice-3-text" onClick={(e) => choice3_button(e)}>{choice3}</button>
        </div>
      </div>
    ) : (
      <div id="input_box">
      <p id="prompt">
        Please describe the setting for your adventure:
      </p>
        <textarea
          id="input"
          name="input"
          rows="3"
          cols="60"
          value={input}
          onChange={(e) => textbox_updated(e)}
        />
       
        <div id="button_box">
          <button id="button" onClick={(e) => submit_button(e)}>Submit</button>
        </div>
      </div> 
      
    )}
      
      </div>
    
      <div id="right_side">
      <div id="output">
        <p id="output_text">
          {output}
        </p>
      </div>
      </div>
      

      
      
      
    </div>
  )

}